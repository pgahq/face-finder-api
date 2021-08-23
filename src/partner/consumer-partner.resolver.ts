import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { Consumer } from 'consumer/entities/consumer.entity';

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
}
