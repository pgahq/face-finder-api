import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  from: process.env.MAILER_FROM,
}));
