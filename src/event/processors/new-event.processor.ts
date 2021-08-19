import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { Event } from '../entities/event.entity';
import { EventService } from '../event.service';
import { newEventQueueConstants } from '../new-event-queue.constant';

@Processor(newEventQueueConstants.name)
export class NewEventProcessor {
  private readonly logger = new Logger(NewEventProcessor.name);
  constructor(private readonly eventService: EventService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `NewEventProcessor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `NewEventProcessor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `NewEventProcessor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(newEventQueueConstants.handler)
  async handleClassifyPhotosOfEvent(job: Job<Event>) {
    const event = job.data;
    await this.eventService.classifyPhotosOfEvent(event);
  }
}
