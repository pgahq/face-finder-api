import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConnection, IsNull, Not } from 'typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';
import { PhotoService } from 'photo/photo.service';

import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
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

  async classifyPhotosOfEvent(event: Event) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [files] = await this.storage
        .bucket(
          this.configService.get<string>('googleCloud.storageGalleryBucket'),
        )
        .getFiles({ prefix: event.gcsBucket });
      const consumers = await queryRunner.manager.find(Consumer, {
        selfieUuid: Not(IsNull()),
      });
      for (const consumer of consumers) {
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
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
