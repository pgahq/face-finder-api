import { registerAs } from '@nestjs/config';

export default registerAs('googleStorage', () => ({
  projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_STORAGE_KEY_FILENAME,
  galleryBucket: process.env.GOOGLE_STORAGE_GALLERY_BUCKET,
}));
