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

import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';

import { ConsumerAnswer } from '../../question/entities/consumer-answer.entity';

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
  consumerAnswers: Promise<ConsumerAnswer[]>;
}
