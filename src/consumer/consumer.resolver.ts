import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Consumer } from 'consumer/entitites/consumer.entity';
import axios from 'axios';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CompreFace } from '@exadel/compreface-js-sdk';


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

    let api_key = "00000000-0000-0000-0000-000000000002";
    let url = "http://localhost";
    let port = 8000;

    let compreFace = new CompreFace(url, port); // set CompreFace url and port 
    let recognitionService = compreFace.initFaceRecognitionService(api_key); // initialize service
    let faceCollection = recognitionService.getFaceCollection(); // use face collection to fill it with known faces
    console.log(faceCollection)
    // const formData = new FormData()
    // formData.append('file', blob)
    
    // axios({
    //   method: 'post',
    //   url: 'http://localhost:8000/api/v1/recognition/faces?subject=1234',
    //   headers: {
    //     'x-api-key': '00000000-0000-0000-0000-000000000002'
    //   },
    //   data: formData
    // })
    // .then(function (response) {
    //   console.log(response.data)
    // }).catch(function(error) {
    //   console.log(error.response.data);
    // });
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