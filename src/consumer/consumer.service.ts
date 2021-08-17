import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConnection } from 'typeorm';

import { Event } from 'event/entities/event.entity';
import { PhotoService } from 'photo/photo.service';

import { Consumer } from './entities/consumer.entity';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly photoService: PhotoService,
  ) {}

  private readonly storage = new Storage({
    projectId: this.configService.get<string>('googleCloud.projectId'),
    credentials: this.configService.get<Record<string, unknown>>(
      'googleCloud.credentials',
    ),
  });

  async classifyPhotosByConsumer(consumer: Consumer) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const events = await queryRunner.manager.find(Event);

      for (const event of events) {
        const [files] = await this.storage
          .bucket(
            this.configService.get<string>('googleCloud.storageGalleryBucket'),
          )
          .getFiles({ prefix: event.gcsBucket });

        for (const file of files) {
          if (!file.name.endsWith('/')) {
            await this.photoService.findFace(
              queryRunner,
              consumer,
              file,
              event,
            );
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
