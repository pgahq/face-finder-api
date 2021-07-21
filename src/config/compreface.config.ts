import { registerAs } from '@nestjs/config';

export default registerAs('compreface', () => ({
  api_key: process.env.COMPREFACE_API_KEY,
}));
