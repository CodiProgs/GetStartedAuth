import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Public } from 'common/common/decorators/public.decorator';
import { Request } from 'express';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) { }

  @Query(() => User)
  async getUserProfile(
    @Args('idOrEmail') idOrEmail: string,
  ) {
    return await this.userService.findOne(idOrEmail)
  }
}
