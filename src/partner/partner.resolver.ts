import {
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserGuard } from 'auth/guards/user.guard';
import { Partner } from 'partner/entities/partner.entity';

import { CreatePartnerInput } from './dto/create-partner.input';
import { UpdatePartnerInput } from './dto/update-partner.input';

@Resolver(() => Partner)
export class PartnerResolver {
  @Query(() => [Partner], { name: 'partners' })
  @UseGuards(UserGuard)
  async findAll() {
    return await Partner.find();
  }

  @Query(() => Partner, { name: 'partner' })
  @UseGuards(UserGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const partner = await Partner.findOne(id);
    if (!partner) {
      throw new NotFoundException(id);
    }
    return partner;
  }

  @Mutation(() => Partner)
  @UseGuards(UserGuard)
  async createPartner(
    @Args('createPartnerInput') createPartnerInput: CreatePartnerInput,
  ) {
    const partner = new Partner();
    partner.name = createPartnerInput.name;
    partner.email = createPartnerInput.email;

    return await partner.save();
  }

  @Mutation(() => Partner)
  @UseGuards(UserGuard)
  async updateEvent(
    @Args('updatePartnerInput') updatePartnerInput: UpdatePartnerInput,
  ) {
    const partner = await Partner.findOne(updatePartnerInput.id);
    if (!partner) {
      throw new NotFoundException(updatePartnerInput.id);
    }
    if (updatePartnerInput.email) {
      partner.email = updatePartnerInput.email;
    }
    if (updatePartnerInput.name) {
      partner.name = updatePartnerInput.name;
    }
    return await partner.save();
  }

  @Mutation(() => Partner)
  @UseGuards(UserGuard)
  async removePartner(@Args('id', { type: () => Int }) id: number) {
    const partner = await Partner.findOne(id);
    if (partner) {
      return await partner.remove();
    }
    throw new NotFoundException();
  }
}
