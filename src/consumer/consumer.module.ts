import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { ConsumerService } from 'consumer/consumer.service';
import { ConsumerPhoto } from 'consumer/entitites/consumer-photo.entity';
import { Event } from 'consumer/entitites/event.entity';
import { Photo } from 'consumer/entitites/photo.entity';
import { EventResolver } from 'consumer/event.resolver';
import { NewConsumerProcessor } from 'consumer/processors/new-consumer.processor';
import { queueConstants } from 'consumer/queue.constant';

import { ConsumerResolver } from './consumer.resolver';
import { Consumer } from './entitites/consumer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer, Photo, Event, ConsumerPhoto]),
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
      name: queueConstants.newConsumer,
    }),
  ],
  providers: [
    ConsumerResolver,
    ConsumerService,
    ConsumerJwtStrategy,
    NewConsumerProcessor,
    EventResolver,
    UserJwtStrategy,
  ],
})
export class ConsumerModule {}
