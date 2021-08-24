import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateConsumerAnswerInput {
  @Field(() => Int)
  questionId: number;

  @Field(() => String)
  answer: string;
}
