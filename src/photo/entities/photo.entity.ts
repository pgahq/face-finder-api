import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from 'event/entities/event.entity';

import { ConsumerPhoto } from './consumer-photo.entity';

@ObjectType()
@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  filename: string;

  @Field(() => String)
  proxyURL: string;

  @OneToMany(() => ConsumerPhoto, (consumerPhotos) => consumerPhotos.photo)
  consumerPhotos: Promise<ConsumerPhoto[]>;

  @ManyToOne(() => Event, (event) => event.photos)
  @Field(() => Event)
  event: Promise<Event>;
}
