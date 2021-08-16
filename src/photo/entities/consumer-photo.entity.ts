import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';

import { Photo } from './photo.entity';

@ObjectType()
@Entity('consumerPhoto')
export class ConsumerPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'int' })
  consumerId: number;

  @Column({ type: 'int' })
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

  @ManyToOne(() => Photo, (photo) => photo.consumerPhotos)
  @Field(() => Photo)
  photo: Promise<Photo>;

  @ManyToOne(() => Consumer, (consumer) => consumer.consumerPhotos, {
    eager: true,
  })
  @Field(() => Consumer)
  consumer: Promise<Consumer>;
}
