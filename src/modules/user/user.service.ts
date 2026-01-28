import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const checkUser = await this.userModel.findOne({
      $or: [
        { email: updateUserDto.email },
        { username: updateUserDto.username },
      ],
    });

    if (checkUser)
      throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('Không tìm thấy người dùng');
    return updatedUser;
  }

  async getAllUser(): Promise<User[]> {
    return await this.userModel.find().select('-password');
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async getAllStudent(): Promise<User[]> {
    return await this.userModel
      .find({ role: Role.STUDENT })
      .select('-password');
  }
}
