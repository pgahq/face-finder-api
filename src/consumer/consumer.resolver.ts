import { InjectQueue } from '@nestjs/bull';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Job, Queue } from 'bull';
import * as FormData from 'form-data';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { UserGuard } from 'auth/guards/user.guard';
import { Event } from 'event/entities/event.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { ComprefaceService } from 'utils';

import { ConsumerEventType } from './dto/consumer-event.type';
import { SNSAccountInput } from './dto/sns-account.input';
import { VerifyConsumerType } from './dto/verify-consumer.type';
import { Consumer } from './entities/consumer.entity';
import { ConsumerJob } from './entities/consumer-job.entity';
import { ConsumerSNSAccount } from './entities/consumer-sns-account.entity';
import { newConsumerQueueConstants } from './new-consumer-queue.constant';

@Resolver()
export class ConsumerResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectQueue(newConsumerQueueConstants.name)
    private readonly newConsumerQueue: Queue,
  ) {}

  @Mutation(() => VerifyConsumerType)
  async verifyConsumer(
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload,
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    const { filename, mimetype, encoding, createReadStream } = selfie;
    const formData = new FormData();
    formData.append('file', createReadStream(), {
      contentType: mimetype,
      filename: filename,
    });

    const comprefaceService = new ComprefaceService(
      this.configService.get<string>('compreface.host'),
      this.configService.get<string>('compreface.apiKey'),
    );
    let consumer = await Consumer.findOne({ email: email });
    if (!consumer) {
      // create new consumer and add example selfie for consumer
      consumer = new Consumer();
      consumer.email = email;
      await consumer.save();
    }
    if (!consumer.selfieUuid) {
      try {
        const selfieUuid = await comprefaceService.addExample(
          formData,
          consumer.id,
          {},
        );
        consumer.selfieUuid = selfieUuid;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
      await consumer.save();
      await this.consumerJob(consumer);
    } else {
      // verify consumer with selfie input
      let matching = false;
      try {
        const response = await comprefaceService.verify(
          formData,
          consumer.selfieUuid,
          { limit: 1 },
        );
        if (Array.isArray(response) && response.length >= 1) {
          const matchSubject = response[0];
          console.log(matchSubject);
          if (
            matchSubject.similarity >=
            this.configService.get('compreface.singleSimilarityThreshold')
          ) {
            matching = true;
          }
        }
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
      if (!matching) {
        throw new UnauthorizedException('Your face is not matching');
      }
    }
    return {
      email: consumer.email,
      accessToken: this.jwtService.sign({
        email: consumer.email,
        sub: consumer.id,
      }),
      expiresIn: this.configService.get<string>('auth.expiresIn'),
    };
  }

  async consumerJob(consumer: Consumer) {
    try {
      const job = await this.newConsumerQueue.add(
        newConsumerQueueConstants.handler,
        consumer,
      );
      const consumerJob = new ConsumerJob();
      consumerJob.consumer = consumer;
      consumerJob.jobId = Number(job.id);
      consumerJob.status = false;
      await consumerJob.save();
    } catch (e) {
      console.error(e);
    }
  }

  @Mutation(() => Consumer)
  @UseGuards(ConsumerGuard)
  async updateSNSAccounts(
    @CurrentUser() consumer: Consumer,
    @Args('consumerSNSAccounts', { type: () => [SNSAccountInput] })
    snsAccounts: [SNSAccountInput],
  ) {
    for (const account of snsAccounts) {
      let consumerAccount = await ConsumerSNSAccount.findOne({
        consumerId: consumer.id,
        sns: account.sns,
      });
      if (consumerAccount) {
        consumerAccount.profileUrl = account.profileUrl;
      } else {
        consumerAccount = new ConsumerSNSAccount();
        consumerAccount.consumer = Promise.resolve(consumer);
        consumerAccount.sns = account.sns;
        consumerAccount.profileUrl = account.profileUrl;
      }
      await consumerAccount.save();
    }
    return consumer;
  }

  @Query(() => [ConsumerPhoto])
  @UseGuards(ConsumerGuard)
  async myPhotosInEvent(
    @CurrentUser() consumer: Consumer,
    @Args('eventId', { type: () => Int }) eventId: number,
  ) {
    const event = Event.findOne(eventId);
    if (event) {
      const consumerPhotos = await consumer.consumerPhotos;
      const filteredConsumerPhotos = [];
      for (const cPhoto of consumerPhotos) {
        const photo = await cPhoto.photo;
        const event = await photo.event;
        if (event.id === eventId) {
          filteredConsumerPhotos.push(cPhoto);
        }
      }
      return filteredConsumerPhotos;
    }
    throw new NotFoundException('event not found');
  }

  @Query(() => [Consumer])
  @UseGuards(UserGuard)
  async consumers() {
    return await Consumer.find();
  }

  @Query(() => ConsumerEventType)
  @UseGuards(ConsumerGuard)
  async myEvents(@CurrentUser() consumer: Consumer) {
    const eventMap = new Map<number, Event>();
    const consumerPhotos = await consumer.consumerPhotos;
    for (const cPhoto of consumerPhotos) {
      const photo = await cPhoto.photo;
      const event = await photo.event;
      if (!eventMap.has(event.id)) {
        eventMap.set(event.id, event);
      }
    }
    const consumerJob = await ConsumerJob.findOne({
      consumerId: consumer.id,
    });
    if (consumerJob && !consumerJob.status) {
      return {
        consumer: consumer,
        status: false,
        events: [],
      };
    }
    // no job + job done
    // handle old consumers
    return {
      consumer: consumer,
      events: Array.from(eventMap.values()),
      status: true,
    };
  }
}
