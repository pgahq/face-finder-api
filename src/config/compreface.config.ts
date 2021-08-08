import { registerAs } from '@nestjs/config';

export default registerAs('compreface', () => ({
  apiKey: process.env.COMPREFACE_API_KEY,
  host: process.env.COMPREFACE_HOST,
  singleSimilarityThreshold:
    parseFloat(process.env.COMPREFACE_VERIFY_SINGLE_SIMILARITY_THRESHOLD) ||
    0.95,
  groupSimilarityThreshold:
    parseFloat(process.env.COMPREFACE_VERIFY_GROUP_SIMILARITY_THRESHOLD) || 0.9,
}));
