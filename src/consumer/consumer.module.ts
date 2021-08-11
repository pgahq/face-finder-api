import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { ConsumerService } from 'consumer/consumer.service';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { Event } from 'event/entities/event.entity';
import { Photo } from 'photo/entities/photo.entity';
import { NewConsumerProcessor } from 'consumer/processors/new-consumer.processor';
import { newConsumerQueueConstants } from 'consumer/new-consumer-queue.constant';

import { ConsumerResolver } from './consumer.resolver';
import { Consumer } from './entities/consumer.entity';
import { EventModule } from 'event/event.module';

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
      name: newConsumerQueueConstants.name,
    }),
  ],
  providers: [
    ConsumerResolver,
    ConsumerService,
    ConsumerJwtStrategy,
    NewConsumerProcessor,
    UserJwtStrategy,
  ],
})
export class ConsumerModule {}
