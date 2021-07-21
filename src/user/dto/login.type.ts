import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginType {
  @Field(() => String)
  username: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  expiredIn: string;
}
