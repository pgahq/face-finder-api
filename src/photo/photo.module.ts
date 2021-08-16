import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';
import { Event } from 'event/entities/event.entity';

import { ConsumerPhoto } from './entities/consumer-photo.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Event, Consumer, ConsumerPhoto])],
})
export class PhotoModule {}