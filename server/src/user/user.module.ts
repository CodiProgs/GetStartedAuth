import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { UserService } from './user.service';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
  imports: [CacheModule.register(), FileModule],
})
export class UserModule { }
