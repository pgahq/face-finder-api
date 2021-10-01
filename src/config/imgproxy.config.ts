import { registerAs } from '@nestjs/config';

export default registerAs('imgproxy', () => ({
  url: process.env.IMGPROXY_URL,
  salt: process.env.IMGPROXY_SALT,
  key: process.env.IMGPROXY_KEY,
}));
