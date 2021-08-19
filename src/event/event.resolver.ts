import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Queue } from 'bull';

import { UserGuard } from 'auth/guards/user.guard';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';
import { newEventQueueConstants } from './new-event-queue.constant';

@Resolver(() => Event)
export class EventResolver {
  constructor(
    @InjectQueue(newEventQueueConstants.name)
    private readonly newEventQueue: Queue,
  ) {}
  @Query(() => [Event], { name: 'events' })
  @UseGuards(UserGuard)
  async findAll() {
    const events = await Event.find();
    return events;
  }

  @Query(() => Event, { name: 'event' })
  @UseGuards(UserGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    if (!event) {
      throw new NotFoundException(id);
    }
    return event;
  }

  @Mutation(() => Event)
  @UseGuards(UserGuard)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    const event = new Event();
    event.name = createEventInput.name;
    event.startTime = createEventInput.startTime;
    event.endTime = createEventInput.endTime;
    event.gcsBucket = createEventInput.gcsBucket;
    const savedEvent = await event.save();
    await this.newEventQueue.add(newEventQueueConstants.handler, savedEvent);
    return savedEvent;
  }

  @Mutation(() => Event)
  @UseGuards(UserGuard)
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
    // not update gcs bucket of event
    if (updateEventInput.gcsBucket && !event.gcsBucket) {
      event.gcsBucket = updateEventInput.gcsBucket;
    }
    if (updateEventInput.gcsBucket && event.gcsBucket) {
      throw new BadRequestException('Cannot update gcs bucket of event');
    }
    return await event.save();
  }

  @Mutation(() => Event)
  @UseGuards(UserGuard)
  async removeEvent(@Args('id', { type: () => Int }) id: number) {
    const event = await Event.findOne(id);
    if (event) {
      return await event.remove();
    }
    throw new NotFoundException();
  }
}
