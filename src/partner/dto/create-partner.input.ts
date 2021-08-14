import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePartnerInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;
}
