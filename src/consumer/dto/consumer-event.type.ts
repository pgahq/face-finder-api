import { Field, ObjectType } from '@nestjs/graphql';

import { Consumer } from 'consumer/entities/consumer.entity';
import { Event } from 'event/entities/event.entity';

@ObjectType()
export class ConsumerEventType {
  @Field(() => String)
  consumer: Consumer;

  @Field(() => [Event])
  events: [Event];

  @Field(() => Boolean)
  status: boolean;
}
