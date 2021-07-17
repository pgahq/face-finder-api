import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  name: string;

  @Field(() => Date)
  start_time: Date;

  @Field(() => Date)
  end_time: Date;

  @Field(() => String)
  gcs_bucket: string;
}
