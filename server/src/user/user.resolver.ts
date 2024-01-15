import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { Public } from 'common/common/decorators/public.decorator';
import { CurrentUser } from 'common/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces';
import { UpdateUserDto } from './dto/user.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Response } from 'express';
import { FileService } from 'src/file/file.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) { }

  @Public()
  @Query(() => User)
  async getUserProfile(
    @Args('nickname') nickname: string,
  ) {
    return await this.userService.findOne(nickname)
  }

  @Mutation(() => String)
  async deleteUser(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Context() context: { res: Response }
  ) {
    context.res.clearCookie('refreshToken')
    return await this.userService.delete(id, user)
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser('id') id: string,
    @Args('updateUserInput') dto: UpdateUserDto
  ) {
    return await this.userService.update(id, dto)
  }

  @Mutation(() => String)
  async updateImage(
    @Args({ name: 'image', type: () => GraphQLUpload }) image: any,
    @CurrentUser('id') id: string
  ) {
    const imagePath = await this.fileService.saveImage(image, 'avatars')
    await this.userService.updateImage(id, imagePath)
    return imagePath
  }
}
