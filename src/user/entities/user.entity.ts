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
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 40 })
  @Field(() => String)
  username: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  password: string;

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
