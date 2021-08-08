import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Consumer } from 'consumer/entitites/consumer.entity';
import { Photo } from 'consumer/entitites/photo.entity';

@ObjectType()
@Entity('consumerPhoto')
export class ConsumerPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  consumerId: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  photoId: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  similarity: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  boxXMax: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  boxXMin: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  boxYMax: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  boxYMin: number;

  @ManyToOne(() => Photo, (photo) => photo.consumerPhoto, { eager: true })
  photo: Photo;

  @ManyToOne(() => Consumer, (consumer) => consumer.consumerPhoto)
  consumer: Consumer;
}
