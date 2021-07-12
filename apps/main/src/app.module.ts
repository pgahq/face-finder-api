import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        autoLoadEntities: true,
      }
      // {
      //   type: "postgres",
      //   host: "localhost",
      //   port: 5432,
      //   username: "postgres",
      //   password: "dothankinh",
      //   database: "pga_main",
      //   autoLoadEntities: true,
      //   migrations: ["migration/*.ts"],
      //   cli: {
      //     migrationsDir: "migration"
      //   }
      // }
    ),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
