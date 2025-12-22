import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ROLE_SYSTEM } from '../../../consts/role.const';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ROLE_SYSTEM)
  role: string;
}
