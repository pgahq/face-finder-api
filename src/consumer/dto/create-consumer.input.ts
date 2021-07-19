import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateConsumerInput {
  @Field(() => String)
  email: string;
}
