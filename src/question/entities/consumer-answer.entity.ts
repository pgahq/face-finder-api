import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';

import { Question } from './question.entity';

@ObjectType()
@Entity('consumerAnswer')
export class ConsumerAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  consumerId: number;

  @Column({ type: 'int' })
  questionId: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  answer: string;

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

  @ManyToOne(() => Consumer, (consumer) => consumer.consumerAnswers)
  @Field(() => Consumer)
  consumer: Promise<Consumer>;

  @ManyToOne(() => Question, (question) => question.consumerAnswers)
  @Field(() => Question)
  question: Promise<Question>;
}
