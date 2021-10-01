import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { Event } from 'event/entities/event.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { Photo } from 'photo/entities/photo.entity';
import { TriggerMailerProcessor } from 'user/processors/trigger-mailer.processor';
import { triggerMailerQueueConstants } from 'user/trigger-mailer-queue.constant';
import { UserService } from 'user/user.service';

import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event, ConsumerPhoto, Photo]),
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
      name: triggerMailerQueueConstants.name,
    }),
  ],

  providers: [
    UserResolver,
    UserJwtStrategy,
    TriggerMailerProcessor,
    UserService,
  ],
})
export class UserModule {}
