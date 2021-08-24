import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { Event } from 'event/entities/event.entity';
import { ConsumerPartnerResolver } from 'partner/consumer-partner.resolver';
import { ConsumerPartner } from 'partner/entities/consumer-partner.entity';
import { EventPartnerResolver } from 'partner/event-partner.resolver';
import { PartnerQuestion } from 'question/entities/partner-question.entity';

import { EventPartner } from './entities/event-partner.entity';
import { Partner } from './entities/partner.entity';
import { PartnerResolver } from './partner.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Partner,
      EventPartner,
      PartnerQuestion,
      ConsumerPartner,
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
  ],
  providers: [
    UserJwtStrategy,
    PartnerResolver,
    ConsumerJwtStrategy,
    EventPartnerResolver,
    ConsumerPartnerResolver,
  ],
})
export class PartnerModule {}
