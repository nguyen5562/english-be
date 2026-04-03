import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { SectionDto } from '../../../modules/shared/section/dto/section.dto';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsMongoId()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  @IsOptional()
  sections: SectionDto[];
}
