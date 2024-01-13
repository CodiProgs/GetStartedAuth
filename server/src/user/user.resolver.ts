import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Public } from 'common/common/decorators/public.decorator';
import { CurrentUser } from 'common/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces';
import { UpdateUserDto } from './dto/user.dto';

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

  @Query(() => String)
  async deleteUser(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.userService.delete(id, user)
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser('id') id: string,
    @Args('updateUserInput') dto: UpdateUserDto
  ) {
    return await this.userService.update(id, dto)
  }
}
