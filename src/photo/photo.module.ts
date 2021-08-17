import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyStrategy } from 'auth/strategies/api-key.strategy';
import { Consumer } from 'consumer/entities/consumer.entity';
import { Event } from 'event/entities/event.entity';
import { PhotoService } from 'photo/photo.service';
import { NewPhotoProcessor } from 'photo/processors/new-photo.processor';

import { ConsumerPhoto } from './entities/consumer-photo.entity';
import { Photo } from './entities/photo.entity';
import { newPhotoQueueConstants } from './new-photo-queue.constant';
import { PhotoResolver } from './photo.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, Event, Consumer, ConsumerPhoto]),
    BullModule.registerQueue({
      name: newPhotoQueueConstants.name,
    }),
  ],
  providers: [PhotoResolver, ApiKeyStrategy, PhotoService, NewPhotoProcessor],
  exports: [PhotoService],
})
export class PhotoModule {}
