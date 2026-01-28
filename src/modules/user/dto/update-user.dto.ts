import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ROLE_SYSTEM } from '../../../consts/system.const';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @IsIn(ROLE_SYSTEM)
  role?: string;
}
