import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly configService: ConfigService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  public validate = (apiKey: string, done: (error: Error, data) => any) => {
    if (this.configService.get<string>('auth.apiKey') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}
