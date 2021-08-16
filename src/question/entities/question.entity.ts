import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConsumerAnswer } from './consumer-answer.entity';
import { PartnerQuestion } from './partner-question.entity';

@ObjectType()
@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  content: string;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  createdAt: Date;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  updatedAt: Date;

  @BeforeInsert()
  public setDate(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updatedAt = new Date();
  }

  @OneToMany(
    () => ConsumerAnswer,
    (consumerAnswers) => consumerAnswers.question,
  )
  @Field(() => [ConsumerAnswer])
  consumerAnswers: Promise<ConsumerAnswer[]>;

  @OneToMany(
    () => PartnerQuestion,
    (partnerQuestions) => partnerQuestions.question,
  )
  partnerQuestions: Promise<PartnerQuestion[]>;
}
