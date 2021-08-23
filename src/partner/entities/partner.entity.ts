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

import { PartnerQuestion } from 'question/entities/partner-question.entity';

import { ConsumerPartner } from '../entities/consumer-partner.entity';
import { EventPartner } from '../entities/event-partner.entity';

@ObjectType()
@Entity()
export class Partner extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  email: string;

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

  @OneToMany(() => EventPartner, (eventPartners) => eventPartners.partner, {
    cascade: true,
  })
  @Field(() => [EventPartner])
  eventPartners: Promise<EventPartner[]>;

  @OneToMany(
    () => PartnerQuestion,
    (partnerQuestions) => partnerQuestions.partner,
    { cascade: true },
  )
  @Field(() => [PartnerQuestion])
  partnerQuestions: Promise<PartnerQuestion[]>;

  @OneToMany(
    () => ConsumerPartner,
    (consumerPartners) => consumerPartners.partner,
    { cascade: true },
  )
  @Field(() => [ConsumerPartner])
  consumerPartners: Promise<ConsumerPartner[]>;
}
