import { registerAs } from '@nestjs/config';

export default registerAs('googleCloud', () => ({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  storageGalleryBucket: process.env.GOOGLE_CLOUD_STORAGE_GALLERY_BUCKET,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
}));
