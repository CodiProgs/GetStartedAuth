import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Public } from 'common/common/decorators/public.decorator';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) { }

  @Public()
  @Query(() => User)
  async getUserProfile(
    @Args('nickname') nickname: string,
  ) {
    return await this.userService.findOne(nickname)
  }
}
