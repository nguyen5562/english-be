import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        _id: user._id,
        user: user,
      };
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const payload: JwtPayload = {
      sub: user._id,
      username: user.user.username,
      email: user.user.email,
      role: user.user.role,
    };

    return {
      user: user.user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
