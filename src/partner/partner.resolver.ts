import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Partner } from 'partner/entities/partner.entity';

import { UserGuard } from '../auth/guards/user.guard';
import { Event } from '../event/entities/event.entity';
import { CreatePartnerInput } from './dto/create-partner.input';
import { UpdatePartnerInput } from './dto/update-partner.input';
import { EventPartner } from './entities/event-partner.entity';

@Resolver(() => Partner)
export class PartnerResolver {
  @Query(() => [Partner], { name: 'partners' })
  @UseGuards(UserGuard)
  async findAll() {
    const partners = await Partner.find();
    return partners;
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

  @Mutation(() => EventPartner)
  @UseGuards(UserGuard)
  async sponsor(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('partnerId', { type: () => Int }) partnerId: number,
  ) {
    const event = await Event.findOne(eventId);
    const partner = await Partner.findOne(partnerId);
    if (event && partner) {
      const eventPartner = new EventPartner();
      eventPartner.event = event;
      eventPartner.partner = partner;
      return eventPartner.save();
    }
    throw new BadRequestException();
  }
}
