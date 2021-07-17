import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities/event.entity';
import { EventResolver } from './event.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventResolver],
})
export class EventModule {}
