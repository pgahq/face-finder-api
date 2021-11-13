import { File, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Imgproxy from 'imgproxy';
import { getConnection, IsNull, Not, QueryRunner } from 'typeorm';

import { Consumer } from 'consumer/entities/consumer.entity';
import { Event } from 'event/entities/event.entity';
import { ComprefaceService } from 'utils';

import { ConsumerPhoto } from './entities/consumer-photo.entity';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotoService {
  constructor(private readonly configService: ConfigService) {}

  private readonly storage = new Storage({
    projectId: this.configService.get<string>('googleCloud.projectId'),
    credentials: this.configService.get<Record<string, unknown>>(
      'googleCloud.credentials',
    ),
  });

  private readonly comprefaceService = new ComprefaceService(
    this.configService.get<string>('compreface.host'),
    this.configService.get<string>('compreface.apiKey'),
  );

  private readonly imgproxy = new Imgproxy({
    baseUrl: this.configService.get<string>('imgproxy.url'),
    key: this.configService.get<string>('imgproxy.key'),
    salt: this.configService.get<string>('imgproxy.salt'),
    encode: true,
  });

  async recognizeFaces(filename: string) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //find event by prefix
      if (filename.endsWith('/')) {
        throw new Error('only process a file');
      }
      const filenameParts = filename.split('/');
      if (filenameParts.length < 2) {
        throw new Error('wrong filename pattern');
      }
      const prefix = filenameParts[0] + '/';
      const event = await queryRunner.manager.findOne(Event, {
        gcsBucket: prefix,
      });
      if (!event) {
        throw new Error('no registered event');
      }
      const file = this.storage
        .bucket(
          this.configService.get<string>('googleCloud.storageGalleryBucket'),
        )
        .file(filename);
      if (!file) {
        throw new Error('file does not exist');
      }
      const consumers = await queryRunner.manager.find(Consumer, {
        selfieUuid: Not(IsNull()),
      });
      for (const consumer of consumers) {
        await this.findFace(queryRunner, consumer, file, event);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findFace(
    queryRunner: QueryRunner,
    consumer: Consumer,
    file: File,
    event: Event,
  ) {
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
        photo.event = Promise.resolve(event);
        await queryRunner.manager.save(Photo, photo);
      }
      const consumerPhoto = new ConsumerPhoto();
      consumerPhoto.consumer = Promise.resolve(consumer);
      consumerPhoto.photo = Promise.resolve(photo);
      consumerPhoto.similarity = mostSimilar.similarity;
      consumerPhoto.boxXMin = mostSimilar.box.x_min;
      consumerPhoto.boxXMax = mostSimilar.box.x_max;
      consumerPhoto.boxYMin = mostSimilar.box.y_min;
      consumerPhoto.boxYMax = mostSimilar.box.y_max;
      await queryRunner.manager.save(ConsumerPhoto, consumerPhoto);
    }
  }

  async getPhotoUrl(filename: string) {
    const photoUrl = `gs://${this.configService.get<string>(
      'googleCloud.storageGalleryBucket',
    )}/${filename}`;
    return `https://${this.imgproxy.builder().generateUrl(photoUrl, 'png')}`;
  }
}
