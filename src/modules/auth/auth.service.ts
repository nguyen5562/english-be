import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
        username: user.username,
        user: user,
      };
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const payload = {
      sub: user._id,
      username: user.username,
    };

    return {
      user: user.user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
