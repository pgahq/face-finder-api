import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateConsumerAnswerInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  answer: string;
}
