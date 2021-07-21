import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Consumer } from 'consumer/entitites/consumer.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import * as FormData from 'form-data';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ComprefaceService } from 'utils/compreface.util';
import { ConfigService } from '@nestjs/config';

@Resolver()
export class ConsumerResolver {
  constructor(private readonly configService: ConfigService) {}
  @Mutation(() => Consumer)
  async verifyConsumer(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload
  ) {
    const {filename, mimetype, encoding, createReadStream} = selfie 
    const formData = new FormData()
    formData.append('file', createReadStream(), {contentType: mimetype, filename: filename})
    const comprefaceService = new ComprefaceService(
      this.configService.get<string>("compreface.host"), 
      this.configService.get<string>("compreface.api_key")
    );
    let consumer = await Consumer.findOne({"email": email})
    if (!consumer) {
      // create new consumer and add example selfie for consumer
      const newConsumer = new Consumer()
      newConsumer.email = email
      try {
        const selfie_uuid = await comprefaceService.addExample(formData, email, {})
        newConsumer.selfie_uuid = selfie_uuid
      } catch (error) {
        throw new BadRequestException(error);
      };
      return await newConsumer.save()
    } 
      // verify consumer with selfie input
    let matchSubjects 
    try {
      const response = await comprefaceService.verify(formData, consumer.selfie_uuid, {limit: 1})
      matchSubjects = response
    } catch (error) {
      throw new BadRequestException(error);
    };
    
    console.log(matchSubjects)
    if (Array.isArray(matchSubjects) && matchSubjects.length >= 1) {
      let matchSubject = matchSubjects[0]
      if (matchSubject.similarity >= this.configService.get("compreface.similarity_threshold")) {
        return consumer
      }
    }
    throw new UnauthorizedException("Your face is not matching")
  }
}