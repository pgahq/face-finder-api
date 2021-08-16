import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy';
import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { Event } from 'event/entities/event.entity';
import { PartnerQuestion } from 'question/entities/partner-question.entity';

import { EventPartner } from './entities/event-partner.entity';
import { Partner } from './entities/partner.entity';
import { PartnerResolver } from './partner.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Partner, EventPartner, PartnerQuestion]),
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
  providers: [UserJwtStrategy, PartnerResolver, ConsumerJwtStrategy],
})
export class PartnerModule {}
