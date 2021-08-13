import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Consumer } from 'consumer/entities/consumer.entity';

@Injectable()
export class ConsumerJwtStrategy extends PassportStrategy(
  Strategy,
  'consumer-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret'),
    });
  }

  async validate(validationPayload: {
    email: string;
    sub: number;
  }): Promise<any> {
    const consumer = await Consumer.findOne(validationPayload.sub);
    if (!consumer || validationPayload.email !== consumer.email) {
      throw new UnauthorizedException();
    }
    return consumer;
  }
}
