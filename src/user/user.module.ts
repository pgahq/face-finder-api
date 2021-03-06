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
import { PhotoService } from 'photo/photo.service';

import { User } from './entities/user.entity';
import { mailerQueueConstants } from './mailer-queue.constant';
import { MailerProcessor } from './processors/mailer.processor';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

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
      name: mailerQueueConstants.name,
    }),
  ],

  providers: [
    UserResolver,
    UserJwtStrategy,
    MailerProcessor,
    UserService,
    PhotoService,
  ],
})
export class UserModule {}
