import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Tokens } from './interfaces';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService
  ) { }

  async register(dto: RegisterDto) {
    return await this.userService.create(dto).catch(err => {
      if (err.code === 'P2002') {
        throw new BadRequestException({ email: 'Email already exists' })
      }
      throw new BadRequestException({ UnexpectedError: 'Unexpected error' })
    })
  }

  async login(dto: LoginDto, userAgent: string) {
    const user: User = await this.userService.findOne(dto.email, true)
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException({ invalidCredentials: 'Wrong email or password' })
    }
    return await this.generateTokens(user, userAgent)
  }

  private async generateTokens(user: User, userAgent: string) {
    const accessToken = 'Bearer ' + await this.jwtService.signAsync({ id: user.id, email: user.email, roles: user.roles })
    const refreshToken = await this.getRefreshToken(user.id, userAgent)

    return { accessToken, refreshToken, user }
  }

  private async getRefreshToken(userId: string, userAgent: string) {
    const token = await this.prisma.token.findFirst({
      where: {
        userId,
        userAgent
      }
    })

    return await this.prisma.token.upsert({
      where: { token: token?.token ?? '' },
      update: {
        token: v4(),
        exp: add(new Date(), { days: 30 })
      },
      create: {
        token: v4(),
        exp: add(new Date(), { days: 30 }),
        userId,
        userAgent
      }
    })
  }

  async setRefreshTokenToCookie(tokens: Tokens, res: Response) {
    if (!tokens) throw new UnauthorizedException()
    res.cookie('refreshToken', tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: await this.config.get('NODE_ENV', 'development') === 'production',
      path: '/',
      expires: new Date(tokens.refreshToken.exp)
    })
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.prisma.token.delete({
      where: {
        token: refreshToken
      }
    })
    if (!token) throw new UnauthorizedException()
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findOne(token.userId)
    return await this.generateTokens(user, token.userAgent)
  }

  async deleteRefreshToken(refreshToken: string) {
    return await this.prisma.token.delete({ where: { token: refreshToken } }).catch((_) => { return null })
  }

  async googleAuth(dto: Partial<User>, userAgent: string) {
    const userExists = await this.userService.findOne(dto.email)
    if (userExists) return await this.generateTokens(userExists, userAgent)
    const newUser = await this.userService.create({ email: dto.email, name: dto.name, avatar: dto.avatar, nickname: dto.email.split('@')[0] }, 'GOOGLE')
    if (!newUser) throw new BadRequestException({ UnexpectedError: 'Unexpected error' })
    return await this.generateTokens(newUser, userAgent)
  }
}
