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

import { ConsumerPartner } from 'partner/entities/consumer-partner.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { ConsumerAnswer } from 'question/entities/consumer-answer.entity';

import { ConsumerSNSAccount } from 'consumer/entities/consumer-sns-account.entity';

@ObjectType()
@Entity()
export class Consumer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar' })
  @Field({ nullable: true })
  selfieUuid: string;

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

  @OneToMany(() => ConsumerPhoto, (consumerPhotos) => consumerPhotos.consumer, {
    cascade: true,
  })
  @Field(() => [ConsumerPhoto])
  consumerPhotos: Promise<ConsumerPhoto[]>;

  @OneToMany(
    () => ConsumerAnswer,
    (consumerAnswers) => consumerAnswers.consumer,
    {
      cascade: true,
    },
  )
  @Field(() => [ConsumerAnswer])
  consumerAnswers: Promise<ConsumerAnswer[]>;

  @OneToMany(
    () => ConsumerPartner,
    (consumerPartners) => consumerPartners.consumer,
    { cascade: true },
  )
  @Field(() => [ConsumerPartner])
  consumerPartners: Promise<ConsumerPartner[]>;

  @OneToMany(
    () => ConsumerSNSAccount,
    (consumerSNSAccounts) => consumerSNSAccounts.consumer,
    {
      cascade: true,
    },
  )
  @Field(() => [ConsumerSNSAccount])
  consumerSNSAccounts: Promise<ConsumerSNSAccount[]>;
}
