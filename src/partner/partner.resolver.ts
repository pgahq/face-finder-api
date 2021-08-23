import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserGuard } from 'auth/guards/user.guard';

import { CreatePartnerInput } from './dto/create-partner.input';
import { UpdatePartnerInput } from './dto/update-partner.input';
import { Partner } from './entities/partner.entity';

@Resolver(() => Partner)
export class PartnerResolver {
  @Query(() => [Partner], { name: 'partners' })
  async findAll() {
    return await Partner.find();
  }

  @Query(() => Partner, { name: 'partner' })
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
  async updatePartner(
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
