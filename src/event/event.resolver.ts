import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'auth/guards/gpl-auth.guard';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';

@Resolver(() => Event)
export class EventResolver {
  @Query(() => [Event], { name: 'events' })
  @UseGuards(GqlAuthGuard)
  async findAll() {
    const events = await Event.find();
    return events;
  }

  @Query(() => Event, { name: 'event' })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    if (!event) {
      throw new NotFoundException(id);
    }
    return event;
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    const event = new Event();
    event.name = createEventInput.name;
    event.start_time = createEventInput.start_time;
    event.end_time = createEventInput.end_time;
    event.gcs_bucket = createEventInput.gcs_bucket;

    return await event.save();
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  async updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ) {
    const event = await Event.findOne(updateEventInput.id);
    if (!event) {
      throw new NotFoundException(updateEventInput.id);
    }
    if (updateEventInput.name) {
      event.name = updateEventInput.name;
    }
    if (updateEventInput.start_time) {
      event.start_time = updateEventInput.start_time;
    }
    if (updateEventInput.end_time) {
      event.end_time = updateEventInput.start_time;
    }
    if (updateEventInput.gcs_bucket) {
      event.gcs_bucket = updateEventInput.gcs_bucket;
    }
    return await event.save();
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  async removeEvent(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    return await event.remove();
  }
}
