import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  name: string;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  @Field({ nullable: true })
  gcsBucket: string;
}
