import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserGuard } from 'auth/guards/user.guard';

import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Resolver(() => Question)
export class QuestionResolver {
  @Mutation(() => Question)
  @UseGuards(UserGuard)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    const question = new Question();
    question.content = createQuestionInput.content;
    return await question.save();
  }

  @Mutation(() => Question)
  @UseGuards(UserGuard)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    const question = await Question.findOne(updateQuestionInput.id);
    if (updateQuestionInput.content) {
      question.content = updateQuestionInput.content;
      return await question.save();
    }
    return question;
  }

  @Query(() => [Question])
  @UseGuards(UserGuard)
  async questions() {
    return await Question.find();
  }

  @Mutation(() => Question)
  @UseGuards(UserGuard)
  async removeQuestion(@Args('id', { type: () => Int }) id: number) {
    const question = await Question.findOne(id);
    if (question) {
      return await question.remove();
    }
    throw new NotFoundException();
  }
}
