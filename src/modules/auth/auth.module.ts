import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '../../configs/env.config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
