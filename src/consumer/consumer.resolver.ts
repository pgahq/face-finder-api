import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Consumer } from 'consumer/entitites/consumer.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import * as FormData from 'form-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';


@Resolver()
export class ConsumerResolver {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => Consumer)
  async createConsumer(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload
  ): Promise<Consumer> {
    const consumer = new Consumer()
    consumer.email = email
    await consumer.save()
    const {filename, mimetype, encoding, createReadStream} = selfie 
  
    const formData = new FormData()
    formData.append('file', createReadStream(), {contentType: mimetype, filename: filename})
    let url = 'http://localhost:8000/api/v1/recognition/faces?subject=1234'
    try {
      const response = await axios.post( url, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              "x-api-key": this.configService.get<string>("compreface.api_key")
          },
      })

      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    return consumer
  }
}