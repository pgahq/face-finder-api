import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { SNSAccountInput } from './sns-account.input';

@InputType()
export class CreateConsumerInput {
  @Field(() => String)
  email: string;

  @Field(() => [SNSAccountInput], { nullable: true })
  snsAccounts: SNSAccountInput[];
}
