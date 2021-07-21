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
}
