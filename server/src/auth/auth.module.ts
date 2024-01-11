import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config/jwt-module-async-option';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AuthService, AuthResolver, ...GUARDS, ...STRATEGIES],
  imports: [UserModule, JwtModule.registerAsync(options()), HttpModule],
})
export class AuthModule { }
