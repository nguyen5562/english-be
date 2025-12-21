import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (checkUser)
      throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }
}
