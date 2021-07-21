import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumer } from './entitites/consumer.entity';

import { ConsumerResolver } from './consumer.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerJwtStrategy } from 'auth/strategies/consumer-jwt.strategy copy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumer]),
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
  providers: [ConsumerResolver, ConsumerJwtStrategy],
})
export class ConsumerModule {}
