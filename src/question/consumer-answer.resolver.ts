import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { ConsumerGuard } from 'auth/guards/consumer.guard';
import { Consumer } from 'consumer/entities/consumer.entity';
import { CreateConsumerAnswerInput } from 'question/dto/create-consumer-answer.input';
import { UpdateConsumerAnswerInput } from 'question/dto/update-consumer-answer.input';
import { ConsumerAnswer } from 'question/entities/consumer-answer.entity';
import { Question } from 'question/entities/question.entity';

@Resolver(() => ConsumerAnswer)
export class ConsumerAnswerResolver {
  @Mutation(() => ConsumerAnswer)
  @UseGuards(ConsumerGuard)
  async createConsumerAnswer(
    @CurrentUser() consumer: Consumer,
    @Args('createConsumerAnswerInput')
    createConsumerAnswerInput: CreateConsumerAnswerInput,
  ) {
    const question = await Question.findOne(
      createConsumerAnswerInput.questionId,
    );
    if (question) {
      const consumerAnswer = new ConsumerAnswer();
      consumerAnswer.consumer = Promise.resolve(consumer);
      consumerAnswer.question = Promise.resolve(question);
      consumerAnswer.answer = createConsumerAnswerInput.answer;
      return await consumerAnswer.save();
    }
    throw new BadRequestException();
  }

  @Mutation(() => ConsumerAnswer)
  @UseGuards(ConsumerGuard)
  async updateConsumerAnswer(
    @CurrentUser() consumer: Consumer,
    @Args('updateConsumerAnswerInput')
    updateConsumerAnswerInput: UpdateConsumerAnswerInput,
  ) {
    const consumerAnswer = await ConsumerAnswer.findOne(
      updateConsumerAnswerInput.id,
    );
    if (!consumerAnswer) {
      throw new NotFoundException();
    }
    if (updateConsumerAnswerInput.answer) {
      consumerAnswer.answer = updateConsumerAnswerInput.answer;
    }
    return await consumerAnswer.save();
  }

  @Query(() => ConsumerAnswer)
  @UseGuards(ConsumerGuard)
  async consumerAnswer(
    @CurrentUser() consumer: Consumer,
    @Args('questionId', { type: () => Int }) questionId: number,
  ) {
    const consumerAnswer = await ConsumerAnswer.findOne({
      questionId: questionId,
      consumerId: consumer.id,
    });
    if (consumerAnswer) {
      return consumerAnswer;
    }
    throw new NotFoundException('Consumers answer is not found');
  }
}
