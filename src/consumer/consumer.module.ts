import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumer } from 'consumer/entitites/consumer.entity';

import { ConsumerResolver } from 'consumer/consumer.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer]),
  ],
  providers: [ConsumerResolver],
})
export class ConsumerModule {}
