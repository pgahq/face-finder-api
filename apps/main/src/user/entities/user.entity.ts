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
@Entity('users')
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

  @BeforeInsert()
  private beforeInsert(): void {
    // Workaround to solve a bug from 0.2.19 version
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  private beforeUpdate(): void {
    this.updated_at = new Date();
  }
}
