import { InjectQueue } from '@nestjs/bull';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Queue } from 'bull';

import { ApiKeyGuard } from 'auth/guards/api-key.guard';

import { Photo } from './entities/photo.entity';
import { newPhotoQueueConstants } from './new-photo-queue.constant';
import { PhotoService } from './photo.service';

@Resolver(() => Photo)
export class PhotoResolver {
  constructor(
    @InjectQueue(newPhotoQueueConstants.name)
    private readonly newPhotoQueue: Queue,
    private readonly photoService: PhotoService,
  ) {}
  @Mutation(() => Boolean)
  @UseGuards(ApiKeyGuard)
  async newPhoto(@Args('filename', { type: () => String }) filename: string) {
    await this.newPhotoQueue.add(newPhotoQueueConstants.handler, filename);
    return true;
  }

  @ResolveField('url', () => String)
  getPhotoUrl(@Parent() photo: Photo) {
    const { filename } = photo;
    return this.photoService.getPhotoUrl(filename);
  }
}
