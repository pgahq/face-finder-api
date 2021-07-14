import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createConnection } from 'typeorm';

import { UserModule } from './user/user.module';
import databaseConfiguration from './config/database.config';
import authConfiguration from './config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        migrations: ['dist/migration/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migration',
        },
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
      connectionFactory: async (options) => {
        const connection = await createConnection(options);
        return connection;
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration, authConfiguration],
    }),
    UserModule,
  ],
})
export class AppModule {}
