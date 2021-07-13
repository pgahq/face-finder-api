import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
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

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  updated_at: Date;
}
