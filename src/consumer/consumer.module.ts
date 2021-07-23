import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { NewConsumerProcessor } from 'consumer/new-consumer.processor';

import { ConsumerResolver } from './consumer.resolver';
import { Consumer } from './entitites/consumer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'new-consumer',
    }),
  ],
  providers: [ConsumerResolver, ConsumerJwtStrategy, NewConsumerProcessor],
})
export class ConsumerModule {}
