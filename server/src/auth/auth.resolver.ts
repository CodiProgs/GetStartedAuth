import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/models/user.model';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { UserAgent } from 'common/common/decorators/user-agent.decorator';
import { BadRequestException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Cookie } from 'common/common/decorators/cookie.decorator';
import { Public } from 'common/common/decorators/public.decorator';
import { STATUS_CODES } from 'http';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap } from 'rxjs';
import { handleTimeoutError } from 'common/common/helpers/timeout-error.helper';

@Public()
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService
  ) { }

  @Mutation(() => String)
  async register(
    @Args('registerInput') dto: RegisterDto,
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
    if (!tokens) throw new BadRequestException({ UnexpectedError: 'Unexpected error' })
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

  @Mutation(() => User)
  googleAuth(
    @Args('token') token: string,
    @Context() context: { res: Response },
    @UserAgent() userAgent: string
  ) {
    return this.httpService.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`).pipe(
      mergeMap(({ data: { email, name, picture } }) => this.authService.googleAuth({ email, name, avatar: picture }, userAgent)),
      map((data) => (this.authService.setRefreshTokenToCookie(data, context.res), { ...data.user, token: data.accessToken })),
      handleTimeoutError())
  }
}
