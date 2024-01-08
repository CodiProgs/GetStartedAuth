import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { $Enums, Provider, User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSeconds } from 'common/common/utils/convert-to-seconds.utils';

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
        roles: ['USER'],
        provider: provider,
        password: user.password ? await bcrypt.hash(user.password, 10) : null,
        nickname: user.nickname
      }
    })
  }

  async findOne(idOrEmail: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(`user:${idOrEmail}`)
    }
    const user: User = await this.cacheManager.get(`user:${idOrEmail}`)
    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { id: idOrEmail },
            { email: idOrEmail }
          ]
        }
      })
      if (!user) return null
      await this.cacheManager.set(`user:${user.id}`, user, convertToSeconds(this.config.get('JWT_EXP')))
      await this.cacheManager.set(`user:${user.email}`, user, convertToSeconds(this.config.get('JWT_EXP')))
      return user
    }
    return user
  }

  // todo!: add delete user, send id and check id from payload
}
