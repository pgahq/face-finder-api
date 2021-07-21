import { registerAs } from '@nestjs/config';

export default registerAs('compreface', () => ({
  api_key: process.env.COMPREFACE_API_KEY,
  host: process.env.COMPREFACE_HOST,
  similarity_threshold: parseFloat(process.env.COMPREFACE_SIMILARITY_THRESHOLD) || 0.95
}));
