import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { Event } from 'event/entities/event.entity';

import { triggerMailerQueueConstants } from '../trigger-mailer-queue.constant';
import { UserService } from '../user.service';

@Processor(triggerMailerQueueConstants.name)
export class TriggerMailerProcessor {
  private readonly logger = new Logger(TriggerMailerProcessor.name);
  constructor(private readonly userService: UserService) {}
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `TriggerMailerProcessor:@OnQueueActive - Processing job ${
        job.id
      } of type ${job.name}. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `TriggerMailerProcessor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `TriggerMailerProcessor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  //  TODO: save event-consumer-mailStatus
  @Process(triggerMailerQueueConstants.handler)
  async handleAfterEvent(job: Job<Event>) {
    const event = job.data;
    await this.userService.sendEmails(event);
  }
}
