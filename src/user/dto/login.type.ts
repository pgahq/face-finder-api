import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginType {
  @Field(() => String)
  username: string;

  @Field(() => String)
  access_token: string;

  @Field(() => String)
  expired_in: string;
}
