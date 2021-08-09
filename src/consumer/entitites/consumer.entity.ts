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

import { ConsumerPhoto } from 'consumer/entitites/consumer-photo.entity';

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

  @OneToMany(() => ConsumerPhoto, (consumerPhoto) => consumerPhoto.consumer, {
    cascade: true,
    eager: true,
  })
  consumerPhoto: ConsumerPhoto[];
}
