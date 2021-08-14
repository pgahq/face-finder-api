import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { EventPartner } from 'partner/entities/event-partner.entity';
import { Photo } from 'photo/entities/photo.entity';

import { Partner } from '../partner/entities/partner.entity';
import { Event } from './entities/event.entity';
import { EventResolver } from './event.resolver';

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
  ],
  providers: [EventResolver, UserJwtStrategy],
})
export class EventModule {}
