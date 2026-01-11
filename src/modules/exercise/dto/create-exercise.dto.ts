import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SectionDto } from '../../section/dto/section.dto';

export class CreateExerciseDto {
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
}
