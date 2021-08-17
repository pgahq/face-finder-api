import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeyStrategy } from 'auth/strategies/api-key.strategy';
import { Consumer } from 'consumer/entities/consumer.entity';
import { Event } from 'event/entities/event.entity';

import { ConsumerPhoto } from './entities/consumer-photo.entity';
import { Photo } from './entities/photo.entity';
import { PhotoResolver } from './photo.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Event, Consumer, ConsumerPhoto])],
  providers: [PhotoResolver, ApiKeyStrategy],
})
export class PhotoModule {}
