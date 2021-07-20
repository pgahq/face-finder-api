import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Consumer } from 'consumer/entitites/consumer.entity';
import axios from 'axios';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import FormData = require("form-data");


@Resolver()
export class ConsumerResolver {
  @Mutation(() => Consumer)
  async createConsumer(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload
  ): Promise<Consumer> {
    const consumer = new Consumer()
    consumer.email = email
    await consumer.save()
    console.log(consumer.id)
    const {filename, mimetype, encoding, createReadStream} = selfie
    
    const blob = await streamToString(createReadStream())
    
    const formData = new FormData()
    formData.append('file', blob)
    
    axios({
      method: 'post',
      url: 'http://localhost:8000/api/v1/recognition/faces?subject=1234',
      headers: {
        'x-api-key': '00000000-0000-0000-0000-000000000002'
      },
      data: formData
    })
    .then(function (response) {
      console.log(response.data)
    }).catch(function(error) {
      console.log(error.response.data);
    });
    return consumer
  }
}

async function streamToString(readableStream): Promise<string> {
  return new Promise(async (resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }