import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { Consumer } from 'consumer/entitites/consumer.entity';

@Processor('new-consumer')
export class NewConsumerProcessor {
  private readonly logger = new Logger(NewConsumerProcessor.name);

  @Process('classify-photos')
  handleClassifyPhotos(job: Job<Consumer>) {
    this.logger.debug('Start classify...');
    this.logger.debug(job.data);
    this.logger.debug('Classifying completed');
  }
}
