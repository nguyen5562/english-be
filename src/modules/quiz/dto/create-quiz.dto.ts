import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SectionDto } from '../../../modules/shared/section/dto/section.dto';
import { Type } from 'class-transformer';

export class CreateQuizDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsOptional()
  sections: SectionDto[];

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;
}
