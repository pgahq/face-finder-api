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
import { Queue } from 'bull';
import { CreateConsumerInput } from 'consumer/dto/create-consumer.input';
import * as FormData from 'form-data';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { UserGuard } from 'auth/guards/user.guard';
import { newConsumerQueueConstants } from 'consumer/new-consumer-queue.constant';
import { Event } from 'event/entities/event.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { ComprefaceService } from 'utils';

import { VerifyConsumerType } from './dto/verify-consumer.type';
import { Consumer } from './entities/consumer.entity';

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
    @Args('createConsumerInput') createConsumerInput: CreateConsumerInput,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload,
  ) {
    const email = createConsumerInput.email;
    const snsAccounts = createConsumerInput.snsAccounts;
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
      await this.newConsumerQueue.add(
        newConsumerQueueConstants.handler,
        consumer,
      );
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

  @Query(() => [Event])
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
    return Array.from(eventMap.values());
  }
}
