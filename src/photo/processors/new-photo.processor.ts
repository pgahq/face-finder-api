import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { newPhotoQueueConstants } from '../new-photo-queue.constant';
import { PhotoService } from '../photo.service';

@Processor(newPhotoQueueConstants.name)
export class NewPhotoProcessor {
  private readonly logger = new Logger(NewPhotoProcessor.name);
  constructor(private readonly photoService: PhotoService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `NewPhotoProcessor:@OnQueueActive - Processing job ${job.id} of type ${
        job.name
      }. Data: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `NewPhotoProcessor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    console.log(
      `NewPhotoProcessor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(newPhotoQueueConstants.handler)
  async handleRecognizeFaces(job: Job<string>) {
    const filename = job.data;
    await this.photoService.recognizeFaces(filename);
  }
}
