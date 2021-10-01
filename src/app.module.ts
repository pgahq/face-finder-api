import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlUploadExpress } from 'graphql-upload';
import { getConnectionOptions } from 'typeorm';

import {
  authConfig,
  comprefaceConfig,
  googleStorageConfig,
  graphqlConfig,
  imgproxyConfig,
  mailerConfig,
} from 'config';
import { ConsumerModule } from 'consumer/consumer.module';
import { EventModule } from 'event/event.module';
import { PartnerModule } from 'partner/partner.module';
import { PhotoModule } from 'photo/photo.module';
import { QuestionModule } from 'question/question.module';
import { UserModule } from 'user/user.module';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        authConfig,
        graphqlConfig,
        comprefaceConfig,
        googleStorageConfig,
        imgproxyConfig,
        mailerConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<GqlModuleOptions> => ({
        playground: configService.get<boolean>('graphql.playground'),
        introspection: configService.get<boolean>('graphql.introspection'),
        autoSchemaFile: true,
        uploads: false,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: parseInt(configService.get('QUEUE_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('mailer.sendgridApiKey'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConsumerModule,
    EventModule,
    PhotoModule,
    PartnerModule,
    QuestionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
