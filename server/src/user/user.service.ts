import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Provider, Role, User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSeconds } from 'common/common/utils/convert-to-seconds.utils';
import { JwtPayload } from 'src/auth/interfaces';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private config: ConfigService
  ) { }

  async create(user: Partial<User>, provider: Provider = 'LOCAL') {
    return await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: ['USER'],
        provider: provider,
        password: user.password ? await bcrypt.hash(user.password, 10) : null,
        nickname: user.nickname
      }
    })
  }

  async findOne(identifier: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(`user:${identifier}`)
    }
    const user: User = await this.cacheManager.get(`user:${identifier}`)
    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { id: identifier },
            { nickname: identifier },
            { email: identifier }
          ]
        }
      })
      if (!user) return null
      await this.cacheManager.store.mset([
        [`user:${user.id}`, user],
        [`user:${user.email}`, user],
        [`user:${user.nickname}`, user]
      ], convertToSeconds(this.config.get('JWT_EXP')))
      return user
    }
    return user
  }

  async delete(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes(Role.ADMIN)) throw new BadRequestException({ UnexpectedError: 'You are not allowed to delete this user' })
    await this.cacheManager.store.mdel(`user:${id}`, `user:${user.email}`, `user:${user.nickname}`)
    const deletedUser = await this.prisma.user.delete({
      where: {
        id
      }
    }).catch(() => { throw new BadRequestException({ UnexpectedError: 'User not found' }) })
    return deletedUser.id
  }
}
