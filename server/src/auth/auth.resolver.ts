import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/models/user.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { UserAgent } from 'common/common/decorators/user-agent.decorator';
import { BadRequestException, HttpCode, HttpStatus, Res, UnauthorizedException } from '@nestjs/common';
import { Cookie } from 'common/common/decorators/cookie.decorator';
import { Public } from 'common/common/decorators/public.decorator';
import { STATUS_CODES } from 'http';

@Public()
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Mutation(() => String)
  async register(
    @Args('registerInput') dto: RegisterDto,
    @Context() context: { res: Response }
  ) {
    await this.authService.register(dto)
    return STATUS_CODES[HttpStatus.CREATED]
  }

  @Mutation(() => User)
  async login(
    @Args('loginInput') dto: LoginDto,
    @UserAgent() userAgent: string,
    @Context() context: { res: Response, req: Request },
  ) {
    const tokens = await this.authService.login(dto, userAgent)
    if (!tokens) throw new BadRequestException('Unexpected error')
    await this.authService.setRefreshTokenToCookie(tokens, context.res)

    return {
      ...tokens.user,
      token: tokens.accessToken
    }
  }

  @Mutation(() => String)
  async logout(
    @Cookie('refreshToken') refreshToken: string,
    @Context() context: { res: Response },
  ) {
    if (!refreshToken) return STATUS_CODES[HttpStatus.OK]
    await this.authService.deleteRefreshToken(refreshToken)
    context.res.clearCookie('refreshToken')
    return STATUS_CODES[HttpStatus.OK]
  }

  @Mutation(() => User)
  async refreshTokens(
    @Cookie('refreshToken') refreshToken: string,
    @Context() context: { res: Response }
  ) {
    if (!refreshToken) throw new UnauthorizedException()
    const tokens = await this.authService.refreshTokens(refreshToken)
    if (!tokens) throw new UnauthorizedException()

    await this.authService.setRefreshTokenToCookie(tokens, context.res)
    return { token: tokens.accessToken }
  }
}
