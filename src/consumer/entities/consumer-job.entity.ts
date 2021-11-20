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

import { Consumer } from '../entities/consumer.entity';

@ObjectType()
@Entity('consumerJob')
export class ConsumerJob extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  consumerId: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  jobId: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  status: boolean;

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

  @ManyToOne(() => Consumer, (consumer) => consumer.consumerSNSAccounts)
  @Field(() => Consumer)
  consumer: Consumer;
}
