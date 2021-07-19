import { Module } from '@nestjs/common';

import { ConsumerResolver } from './consumer.resolver';

@Module({
  providers: [ConsumerResolver],
})
export class ConsumerModule {}
