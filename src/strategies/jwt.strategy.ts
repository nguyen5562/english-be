import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { appConfig } from 'src/configs/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email || !payload.username || !payload.role) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
