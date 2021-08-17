import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { UserGuard } from 'auth/guards/user.guard';
import { Event } from 'event/entities/event.entity';
import { EventPartner } from 'partner/entities/event-partner.entity';
import { Partner } from 'partner/entities/partner.entity';

@Resolver(() => EventPartner)
export class EventPartnerResolver {
  @Mutation(() => EventPartner)
  @UseGuards(UserGuard)
  async sponsorEvent(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('partnerId', { type: () => Int }) partnerId: number,
  ) {
    const event = await Event.findOne(eventId);
    const partner = await Partner.findOne(partnerId);
    if (event && partner) {
      const eventPartner = new EventPartner();
      eventPartner.event = Promise.resolve(event);
      eventPartner.partner = Promise.resolve(partner);
      return eventPartner.save();
    }
    throw new BadRequestException();
  }

  @Mutation(() => Boolean)
  @UseGuards(UserGuard)
  async removeEventPartner(@Args('id', { type: () => Int }) id: number) {
    const eventPartner = await EventPartner.findOne(id);
    if (eventPartner) {
      await eventPartner.remove();
      return true;
    }
    throw new BadRequestException();
  }
}
