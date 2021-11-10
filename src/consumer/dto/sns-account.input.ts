import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SNSAccountInput {
  @Field(() => String)
  sns: string;

  @Field(() => String)
  profileURL: string;
}
