import { InjectQueue } from '@nestjs/bull';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Queue } from 'bull';

import { ApiKeyGuard } from 'auth/guards/api-key.guard';
import { newPhotoQueueConstants } from 'photo/new-photo-queue.constant';

import { Photo } from './entities/photo.entity';

@Resolver(() => Photo)
export class PhotoResolver {
  constructor(
    @InjectQueue(newPhotoQueueConstants.name)
    private readonly newPhotoQueue: Queue,
  ) {}
  @Mutation(() => Boolean)
  @UseGuards(ApiKeyGuard)
  async newPhoto(@Args('filename', { type: () => String }) filename: string) {
    await this.newPhotoQueue.add(newPhotoQueueConstants.handler, filename);
    return true;
  }
}
