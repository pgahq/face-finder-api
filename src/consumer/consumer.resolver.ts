import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bull';
import * as FormData from 'form-data';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { UserGuard } from 'auth/guards/user.guard';
import { Consumer } from 'consumer/entities/consumer.entity';
import { newConsumerQueueConstants } from 'consumer/new-consumer-queue.constant';
import { Event } from 'event/entities/event.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { ComprefaceService } from 'utils';

import { VerifyConsumerType } from './dto/verify-consumer.type';

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
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload,
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
        throw new BadRequestException(error);
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
        throw new BadRequestException(error);
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
      const consumerPhotos = await ConsumerPhoto.find({
        consumerId: consumer.id,
      });
      return consumerPhotos.filter(
        (cPhoto) => cPhoto.photo.event.id === eventId,
      );
    }
    throw new NotFoundException('event not found');
  }

  @Query(() => [Consumer])
  @UseGuards(UserGuard)
  async consumers() {
    return await Consumer.find();
  }
}
