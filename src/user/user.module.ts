import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { expiredIn, jwtSecret } from '../auth/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: expiredIn },
    }),
  ],
  providers: [UserResolver, JwtStrategy],
})
export class UserModule {}
