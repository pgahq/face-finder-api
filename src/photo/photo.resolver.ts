import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ApiKeyGuard } from 'auth/guards/api-key.guard';

import { Photo } from './entities/photo.entity';

@Resolver(() => Photo)
export class PhotoResolver {
  @Mutation(() => Boolean)
  @UseGuards(ApiKeyGuard)
  async newPhoto(@Args('filename', { type: () => String }) filename: string) {
    //  TODO: check if exist and verify faces with existing people
    return true;
  }
}
