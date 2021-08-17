import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  expiresIn: process.env.EXPIRES_IN,
  apiKey: process.env.API_KEY,
}));
