import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginType {
  @Field(() => String, { description: 'Username' })
  username: string;

  @Field(() => String, { description: 'Access token' })
  access_token: string;

  @Field(() => String, { description: 'Expired in' })
  expired_in: string;
}
