import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifyConsumerType {
  @Field(() => String)
  email: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  expiresIn: string;
}
