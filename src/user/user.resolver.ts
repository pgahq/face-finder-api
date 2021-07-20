import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CurrentUser } from 'auth/decorator/current-user.decorator';
import { GqlAuthGuard } from 'auth/guards/gpl-auth.guard';

import { CreateUserInput } from 'user/dto/create-user.input';
import { LoginInput } from 'user/dto/login.input';
import { LoginType } from 'user/dto/login.type';
import { UpdateUserInput } from 'user/dto/update-user.input';
import { User } from './entities/user.entity';

const saltOrRounds = 10;

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = new User();
    user.username = createUserInput.username;
    user.password = await bcrypt.hash(createUserInput.password, saltOrRounds);
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
      user.password = await bcrypt.hash(updateUserInput.password, saltOrRounds);
    }
    return await user.save();
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await User.findOne(id);
    return await user.remove();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return await User.findOne(user.id);
  }

  @Mutation(() => LoginType)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginType> {
    const user = await User.findOne({ username: loginInput.username });
    if (user && (await bcrypt.compare(loginInput.password, user.password))) {
      return {
        username: user.username,
        access_token: this.jwtService.sign({
          username: user.username,
          sub: user.id,
        }),
        expired_in: this.configService.get<string>('auth.expires_in'),
      };
    }
    throw new UnauthorizedException();
  }
}
