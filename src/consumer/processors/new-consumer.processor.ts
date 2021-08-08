import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ConsumerService } from 'consumer/consumer.service';
import { Consumer } from 'consumer/entitites/consumer.entity';
import { queueConstants } from 'consumer/queue.constant';

@Processor(queueConstants.newConsumer)
export class NewConsumerProcessor {
  private readonly logger = new Logger(NewConsumerProcessor.name);
  constructor(private readonly consumerService: ConsumerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('classify-photos')
  async handleClassifyPhotos(job: Job<Consumer>) {
    const newConsumer = job.data;
    await this.consumerService.classifyPhotosByConsumer(newConsumer);
  }
}
