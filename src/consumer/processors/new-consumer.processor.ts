import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ConsumerService } from '../consumer.service';
import { Consumer } from '../entities/consumer.entity';
import { ConsumerJob } from '../entities/consumer-job.entity';
import { newConsumerQueueConstants } from '../new-consumer-queue.constant';

@Processor(newConsumerQueueConstants.name)
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
  async onComplete(job: Job) {
    try {
      const consumerJob = await ConsumerJob.findOne({
        consumerId: job.data.id,
        jobId: Number(job.id),
      });
      if (consumerJob) {
        consumerJob.status = true;
        await consumerJob.save();
      }
    } catch (e) {
      console.error(e);
    }
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

  @Process(newConsumerQueueConstants.handler)
  async handleClassifyPhotos(job: Job<Consumer>) {
    const newConsumer = job.data;
    await this.consumerService.classifyPhotosByConsumer(newConsumer);
  }
}
