import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Partner } from 'partner/entities/partner.entity';

import { Question } from './question.entity';

@ObjectType()
@Entity('partnerQuestion')
export class PartnerQuestion extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  partnerId: number;

  @Column({ type: 'int' })
  questionId: number;

  @ManyToOne(() => Partner, (partner) => partner.partnerQuestions)
  @Field(() => Partner)
  partner: Promise<Partner>;

  @ManyToOne(() => Question, (question) => question.partnerQuestions)
  @Field(() => Question)
  question: Promise<Question>;
}
