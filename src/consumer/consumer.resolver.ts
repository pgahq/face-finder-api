import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Consumer } from 'consumer/entitites/consumer.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import * as FormData from 'form-data';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ComprefaceService } from 'utils';
import { VerifyConsumerType } from './dto/verify-consumer.type';
import { GqlAuthGuard } from 'auth/guards/gpl-auth.guard';
import { CurrentUser } from 'auth/decorator/current-user.decorator';

@Resolver()
export class ConsumerResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation(() => VerifyConsumerType)
  async verifyConsumer(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'selfie', type: () => GraphQLUpload }) selfie: FileUpload
  ) {
    const {filename, mimetype, encoding, createReadStream} = selfie 
    const formData = new FormData()
    formData.append('file', createReadStream(), {contentType: mimetype, filename: filename})
    
    const comprefaceService = new ComprefaceService(
      this.configService.get<string>("compreface.host"), 
      this.configService.get<string>("compreface.apiKey")
    );
    let consumer = await Consumer.findOne({"email": email})
    if (!consumer) {
      // create new consumer and add example selfie for consumer
      consumer = new Consumer()
      consumer.email = email
      try {
        const selfieUuid = await comprefaceService.addExample(formData, email, {})
        consumer.selfieUuid = selfieUuid
      } catch (error) {
        throw new BadRequestException(error);
      };
      await consumer.save()
    } else {
      // verify consumer with selfie input
      let matching = false
      try {
        const response = await comprefaceService.verify(formData, consumer.selfieUuid, {limit: 1})
        if (Array.isArray(response) && response.length >= 1) {
          let matchSubject = response[0]
          if (matchSubject.similarity >= this.configService.get("compreface.similarityThreshold")) {
            matching = true
          }
        }
      } catch (error) {
        throw new BadRequestException(error);
      };
      if (!matching) {
        throw new UnauthorizedException("Your face is not matching"); 
      }
    }  
    return {
      email: consumer.email,
      accessToken: this.jwtService.sign({
        email: consumer.email,
        sub: consumer.id
      }),
      expiresIn: this.configService.get<string>("auth.expiresIn")
    }      
  }

  @Query(() => Consumer)
  @UseGuards(GqlAuthGuard)
  async cInfo(@CurrentUser() consumer: Consumer) {
    return await Consumer.findOne(consumer.id);
  }
}