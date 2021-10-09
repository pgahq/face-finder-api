import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { Queue } from 'bull';
import Imgproxy from 'imgproxy';

import { Event } from 'event/entities/event.entity';
import { ConsumerPhoto } from 'photo/entities/consumer-photo.entity';
import { mailerQueueConstants } from 'user/mailer-queue.constant';

@Injectable()
export class UserService {
  private readonly imgproxy = new Imgproxy({
    baseUrl: this.configService.get<string>('imgproxy.url'),
    key: this.configService.get<string>('imgproxy.key'),
    salt: this.configService.get<string>('imgproxy.salt'),
    encode: true,
  });

  constructor(
    @InjectQueue(mailerQueueConstants.name)
    private readonly triggerMailerQueue: Queue,
    @InjectSendGrid() private readonly sendGridClient: SendGridService,
    private readonly configService: ConfigService,
  ) {}

  async consumerGallery(event: Event): Promise<Map<string, string[]>> {
    const consumerPhotos = new Map<string, string[]>();
    event = await Event.findOne(event.id);
    for (const photo of await event.photos) {
      const photoUrl = `gs://${this.configService.get<string>(
        'googleCloud.storageGalleryBucket',
      )}/${photo.filename}`;
      const photoProxyUrl = this.imgproxy
        .builder()
        .generateUrl(photoUrl, 'png');
      const cps = await ConsumerPhoto.find({ photoId: photo.id });
      for (const c of cps) {
        const consumerEmail = (await c.consumer).email;
        if (consumerPhotos.has(consumerEmail)) {
          const photos = consumerPhotos.get(consumerEmail);
          photos.push(photoProxyUrl);
        } else {
          consumerPhotos.set(consumerEmail, [photoProxyUrl]);
        }
      }
    }
    return consumerPhotos;
  }

  formatPhotos(consumerPhotos: string[]): string {
    let html = '';
    for (const photoUrl of consumerPhotos) {
      html += '<li>' + photoUrl + '</li>';
    }
    return html;
  }

  //TODO:
  // - add template for email
  async triggerMailer(event: Event) {
    const consumerPhotos = await this.consumerGallery(event);
    for (const [consumerEmail, photos] of consumerPhotos) {
      const msg = {
        to: consumerEmail,
        from: this.configService.get<string>('mailer.from'),
        subject: 'PGA - Event gallery',
        html: this.formatPhotos(photos),
      };
      await this.triggerMailerQueue.add(
        mailerQueueConstants.sendEmailHandler,
        msg,
      );
    }
  }

  async sendEmail(msg) {
    await this.sendGridClient.send(msg).catch(async function (error) {
      await this.triggerMailerQueue.add(
        mailerQueueConstants.sendEmailHandler,
        msg,
      );
    });
  }
}
