import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from 'event/entities/event.entity';

import { Partner } from './partner.entity';

@ObjectType()
@Entity('eventPartner')
export class EventPartner extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  eventId: number;

  @Column({ type: 'int' })
  partnerId: number;

  @ManyToOne(() => Partner, (partner) => partner.eventPartners, { eager: true })
  @Field(() => Partner)
  partner: Partner;

  @ManyToOne(() => Event, (event) => event.eventPartners, { eager: true })
  @Field(() => Event)
  event: Event;
}
