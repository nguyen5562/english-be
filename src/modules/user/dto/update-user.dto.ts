import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ROLE_SYSTEM } from '../../../const/role.const';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @IsIn(ROLE_SYSTEM)
  role?: string;
}
