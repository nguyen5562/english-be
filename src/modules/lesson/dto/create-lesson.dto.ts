import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SubDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubDto)
  @IsOptional()
  slides: SubDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubDto)
  @IsOptional()
  videos: SubDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubDto)
  @IsOptional()
  references: SubDto[];
}
