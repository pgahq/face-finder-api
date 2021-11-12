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

@ObjectType()
@Entity('consumerSNSAccount')
export class ConsumerSNSAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  consumerId: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  sns: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  profileUrl: string;

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
  consumer: Promise<Consumer>;
}
