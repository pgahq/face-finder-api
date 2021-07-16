import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String, { description: 'Name of event' })
  name: string;

  @Field(() => Date, { description: 'Start time of event' })
  start_time: Date;

  @Field(() => Date, { description: 'End time of event' })
  end_time: Date;

  @Field(() => String, { description: 'Link to photo storage of event' })
  gcs_bucket: string;
}
