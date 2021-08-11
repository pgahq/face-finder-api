import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { getConnection } from 'typeorm';

import { Consumer } from 'consumer/entitites/consumer.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity'
import { Event } from 'event/entities/event.entity';
import { Photo } from 'photo/entities/photo.entity';
import { ComprefaceService } from 'utils';

@Injectable()
export class ConsumerService {
  constructor(private readonly configService: ConfigService) {}

  private readonly storage = new Storage({
    projectId: this.configService.get<string>('googleCloud.projectId'),
    credentials: this.configService.get<Record<string, unknown>>('googleCloud.credentials')
  })

  private readonly comprefaceService = new ComprefaceService(
    this.configService.get<string>('compreface.host'),
    this.configService.get<string>('compreface.apiKey'),
  );

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
          .bucket(this.configService.get<string>('googleCloud.storageGalleryBucket'))
          .getFiles({ prefix: event.gcsBucket });

        for (const file of files) {
          if (!file.name.endsWith('/')) {
            const fileStream = file.createReadStream();
            const formData = new FormData();
            formData.append('file', fileStream, {
              filename: file.name,
              contentType: file.metadata.contentType,
            });
            const response = await this.comprefaceService.verify(
              formData,
              consumer.selfieUuid,
              {},
            );
            const mostSimilar = response.reduce((max, subject) =>
              max.similarity > subject.similarity ? max : subject,
            );
            if (
              mostSimilar.similarity >=
              this.configService.get('compreface.groupSimilarityThreshold')
            ) {
              let photo = await queryRunner.manager.findOne(Photo, {
                filename: file.name,
              });
              if (!photo) {
                photo = new Photo();
                photo.filename = file.name;
                photo.event = event;
                await queryRunner.manager.save(Photo, photo);
              }
              const consumerPhoto = new ConsumerPhoto();
              consumerPhoto.consumer = consumer;
              consumerPhoto.photo = photo;
              consumerPhoto.similarity = mostSimilar.similarity;
              consumerPhoto.boxXMin = mostSimilar.box.x_min;
              consumerPhoto.boxXMax = mostSimilar.box.x_max;
              consumerPhoto.boxYMin = mostSimilar.box.y_min;
              consumerPhoto.boxYMax = mostSimilar.box.y_max;
              await queryRunner.manager.save(ConsumerPhoto, consumerPhoto);
            }
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
