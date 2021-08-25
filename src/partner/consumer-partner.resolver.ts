import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { UserGuard } from 'auth/guards/user.guard';
import { Consumer } from 'consumer/entities/consumer.entity';
import { ConsumerAnswer } from 'question/entities/consumer-answer.entity';

import { ConsentType } from './dto/consent.type';
import { ConsumerPartner } from './entities/consumer-partner.entity';
import { Partner } from './entities/partner.entity';

@Resolver(() => ConsumerPartner)
export class ConsumerPartnerResolver {
  @Mutation(() => ConsumerPartner)
  @UseGuards(ConsumerGuard)
  async consentPartner(
    @CurrentUser() consumer: Consumer,
    @Args('partnerId', { type: () => Int }) partnerId: number,
  ) {
    const partner = await Partner.findOne(partnerId);
    if (partner) {
      const consumerPartner = new ConsumerPartner();
      consumerPartner.consumer = Promise.resolve(consumer);
      consumerPartner.partner = Promise.resolve(partner);
      return await consumerPartner.save();
    }
    throw new NotFoundException('Partner is not found');
  }

  @Mutation(() => Boolean)
  @UseGuards(ConsumerGuard)
  async removeConsentPartner(@Args('id', { type: () => Int }) id: number) {
    const consent = await ConsumerPartner.findOne(id);
    if (consent) {
      await consent.remove();
    }
    throw new NotFoundException('Consent is not found');
  }

  @Query(() => [ConsentType])
  @UseGuards(UserGuard)
  async partnersConsent(): Promise<ConsentType[]> {
    const consents = [];
    const partners = await Partner.find();
    for (const partner of partners) {
      consents.push(...(await this.getConsentsOfPartner(partner)));
    }
    return consents;
  }

  async getConsentsOfPartner(partner: Partner): Promise<ConsentType[]> {
    const consents = [];
    const consentConsumers = await partner.consumerPartners;
    const partnerQuestions = await partner.partnerQuestions;
    for (const cConsumer of consentConsumers) {
      for (const pQuestion of partnerQuestions) {
        const consumerAnswer = await ConsumerAnswer.findOne({
          consumerId: cConsumer.consumerId,
          questionId: pQuestion.questionId,
        });
        if (consumerAnswer) {
          consents.push({
            partner: partner,
            consumer: await cConsumer.consumer,
            question: await pQuestion.question,
            answer: consumerAnswer.answer,
          });
        }
      }
    }
    return consents;
  }
}
