import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SectionDto } from '../../section/dto/section.dto';

export class CreateQuizDto {
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsNotEmpty()
  sections: SectionDto[];

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;
}
