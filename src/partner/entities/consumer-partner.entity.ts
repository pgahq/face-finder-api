import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';

import { Partner } from './partner.entity';

@ObjectType()
@Entity('consumerPartner')
export class ConsumerPartner extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  consumerId: number;

  @Column({ type: 'int' })
  partnerId: number;

  @ManyToOne(() => Partner, (partner) => partner.consumerPartners)
  @Field(() => Partner)
  partner: Promise<Partner>;

  @ManyToOne(() => Consumer, (consumer) => consumer.consumerPartners)
  @Field(() => Consumer)
  consumer: Promise<Consumer>;
}
