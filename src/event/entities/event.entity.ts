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
  start_time: Date;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  end_time: Date;

  @Column({ type: 'varchar' })
  @Field(() => String)
  gcs_bucket: string;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  created_at: Date;

  @Column({ type: 'timestamp without time zone' })
  @Field(() => Date)
  updated_at: Date;

  @BeforeInsert()
  public setDate(): void {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  public setUpdateDate(): void {
    this.updated_at = new Date();
  }
}
