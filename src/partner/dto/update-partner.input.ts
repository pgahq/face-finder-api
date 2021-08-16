import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreatePartnerInput } from './create-partner.input';

@InputType()
export class UpdatePartnerInput extends PartialType(CreatePartnerInput) {
  @Field(() => Int)
  id: number;
}
