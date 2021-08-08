import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConsumerPhoto } from 'consumer/entitites/consumer-photo.entity';
import { Event } from 'consumer/entitites/event.entity';

@ObjectType()
@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  filename: string;

  @OneToMany(() => ConsumerPhoto, (consumerPhoto) => consumerPhoto.photo)
  consumerPhoto: ConsumerPhoto[];

  @ManyToOne(() => Event, (event) => event.photos, { eager: true })
  event: Event;
}