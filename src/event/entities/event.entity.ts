import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  name: string;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  startTime: Date;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  endTime: Date;

  @Column({ type: 'varchar' })
  @Field({ nullable: true })
  gcsBucket: string;

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
}
