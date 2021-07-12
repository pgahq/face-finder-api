import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.username = createUserInput.username;
    user.password = await bcrypt.hash(createUserInput.password, salt);
    return await user.save();
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    const users = await User.find();
    return users;
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const user = await User.findOne(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = await User.findOne(updateUserInput.id);
    if (!user) {
      throw new NotFoundException(updateUserInput.id);
    }
    if (updateUserInput.username) {
      user.username = updateUserInput.username;
    }
    if (updateUserInput.password) {
      user.password = updateUserInput.password;
    }
    return await user.save();
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await User.findOne(id);
    return await user.remove();
  }
}
