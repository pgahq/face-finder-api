import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { EventService } from 'event/event.service';
import { NewEventProcessor } from 'event/processors/new-event.processor';
import { EventPartner } from 'partner/entities/event-partner.entity';
import { Partner } from 'partner/entities/partner.entity';
import { Photo } from 'photo/entities/photo.entity';
import { PhotoModule } from 'photo/photo.module';

import { Event } from './entities/event.entity';
import { EventResolver } from './event.resolver';
import { newEventQueueConstants } from './new-event-queue.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, Event, EventPartner, Partner]),
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
      name: newEventQueueConstants.name,
    }),
    PhotoModule,
  ],
  providers: [EventResolver, UserJwtStrategy, NewEventProcessor, EventService],
})
export class EventModule {}
