import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt_secret'),
        signOptions: { expiresIn: configService.get<string>('auth.expires_in') }
      }),
      inject: [ConfigService],
    }),
  ],
  
  providers: [UserResolver, JwtStrategy],
})
export class UserModule {}
