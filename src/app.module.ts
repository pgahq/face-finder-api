import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { authConfig, graphqlConfig } from 'config';
import { EventModule } from 'event/event.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, graphqlConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<GqlModuleOptions> => ({
        playground: configService.get<boolean>('graphql.playground'),
        introspection: configService.get<boolean>('graphql.introspection'),
        autoSchemaFile: true
      }),
      inject: [ConfigService],
    }),
    UserModule,
    EventModule,
  ],
})
export class AppModule {}
