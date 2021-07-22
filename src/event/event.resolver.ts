import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserAuthGuard } from 'auth/guards/user-auth.guard';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';

@Resolver(() => Event)
export class EventResolver {
  @Query(() => [Event], { name: 'events' })
  @UseGuards(UserAuthGuard)
  async findAll() {
    const events = await Event.find();
    return events;
  }

  @Query(() => Event, { name: 'event' })
  @UseGuards(UserAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    if (!event) {
      throw new NotFoundException(id);
    }
    return event;
  }

  @Mutation(() => Event)
  @UseGuards(UserAuthGuard)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    const event = new Event();
    event.name = createEventInput.name;
    event.startTime = createEventInput.startTime;
    event.endTime = createEventInput.endTime;
    event.gcsBucket = createEventInput.gcsBucket;

    return await event.save();
  }

  @Mutation(() => Event)
  @UseGuards(UserAuthGuard)
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
    if (updateEventInput.startTime) {
      event.startTime = updateEventInput.startTime;
    }
    if (updateEventInput.endTime) {
      event.endTime = updateEventInput.endTime;
    }
    if (updateEventInput.gcsBucket) {
      event.gcsBucket = updateEventInput.gcsBucket;
    }
    return await event.save();
  }

  @Mutation(() => Event)
  @UseGuards(UserAuthGuard)
  async removeEvent(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    return await event.remove();
  }
}
