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
