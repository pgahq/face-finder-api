import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateConsumerInput {
  @Field(() => String)
  email: string;

  @Field(() => GraphQLUpload)
  image: FileUpload;
}
