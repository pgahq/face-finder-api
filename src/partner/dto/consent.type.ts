import { Field, ObjectType } from '@nestjs/graphql';

import { Consumer } from 'consumer/entities/consumer.entity';
import { Partner } from 'partner/entities/partner.entity';
import { Question } from 'question/entities/question.entity';

@ObjectType()
export class ConsentType {
  @Field(() => Partner)
  partner: Partner;

  @Field(() => Consumer)
  consumer: Consumer;

  @Field(() => Question)
  question: Question;

  @Field(() => String)
  answer: string;
}
