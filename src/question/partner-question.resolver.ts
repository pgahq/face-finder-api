import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { UserGuard } from 'auth/guards/user.guard';
import { Partner } from 'partner/entities/partner.entity';
import { PartnerQuestion } from 'question/entities/partner-question.entity';
import { Question } from 'question/entities/question.entity';

@Resolver(() => PartnerQuestion)
export class PartnerQuestionResolver {
  @Mutation(() => PartnerQuestion)
  @UseGuards(UserGuard)
  async specifyPartnerQuestion(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('partnerId', { type: () => Int }) partnerId: number,
  ) {
    const question = await Question.findOne(questionId);
    const partner = await Partner.findOne(partnerId);
    if (question && partner) {
      const partnerQuestion = new PartnerQuestion();
      partnerQuestion.partner = Promise.resolve(partner);
      partnerQuestion.question = Promise.resolve(question);
      return partnerQuestion.save();
    }
    throw new BadRequestException();
  }

  @Mutation(() => PartnerQuestion)
  @UseGuards(UserGuard)
  async removePartnerQuestion(@Args('id', { type: () => Int }) id: number) {
    const partnerQuestion = await PartnerQuestion.findOne(id);
    if (partnerQuestion) {
      return await partnerQuestion.remove();
    }
  }
}
