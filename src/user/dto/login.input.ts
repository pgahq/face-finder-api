import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Username' })
  username: string;

  @Field(() => String, { description: 'Password' })
  password: string;
}
