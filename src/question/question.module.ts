import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserJwtStrategy } from 'auth/strategies/user-jwt.strategy';
import { Consumer } from 'consumer/entities/consumer.entity';
import { Partner } from 'partner/entities/partner.entity';

import { ConsumerAnswer } from './entities/consumer-answer.entity';
import { PartnerQuestion } from './entities/partner-question.entity';
import { Question } from './entities/question.entity';
import { PartnerQuestionResolver } from './partner-question.resolver';
import { QuestionResolver } from './question.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consumer,
      Question,
      Partner,
      ConsumerAnswer,
      PartnerQuestion,
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
  providers: [UserJwtStrategy, QuestionResolver, PartnerQuestionResolver],
})
export class QuestionModule {}
