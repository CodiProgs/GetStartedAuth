import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
  imports: [CacheModule.register()],
})
export class UserModule { }
