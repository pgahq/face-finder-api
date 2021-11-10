import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { ConsumerSNSAccount } from 'consumer/entities/consumer-sns-account.entity';
import { Event } from 'event/entities/event.entity';
import { ConsumerPartner } from 'partner/entities/consumer-partner.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { Photo } from 'photo/entities/photo.entity';
import { PhotoModule } from 'photo/photo.module';
import { ConsumerAnswer } from 'question/entities/consumer-answer.entity';

import { ConsumerResolver } from './consumer.resolver';
import { ConsumerService } from './consumer.service';
import { Consumer } from './entities/consumer.entity';
import { newConsumerQueueConstants } from './new-consumer-queue.constant';
import { NewConsumerProcessor } from './processors/new-consumer.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consumer,
      Photo,
      Event,
      ConsumerPhoto,
      ConsumerAnswer,
      ConsumerPartner,
      ConsumerSNSAccount,
    ]),
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
    PhotoModule,
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
