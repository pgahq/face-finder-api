import { registerAs } from '@nestjs/config';

export default registerAs('compreface', () => ({
  apiKey: process.env.COMPREFACE_API_KEY,
  host: process.env.COMPREFACE_HOST,
  similarityThreshold:
    parseFloat(process.env.COMPREFACE_SIMILARITY_THRESHOLD) || 0.95,
}));
