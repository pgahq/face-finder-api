import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumer } from './entitites/consumer.entity';

import { ConsumerResolver } from './consumer.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer]),
  ],
  providers: [ConsumerResolver],
})
export class ConsumerModule {}
