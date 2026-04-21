import { Type } from 'class-transformer';
import { ValidateNested, IsMongoId, IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsArray } from 'class-validator';

export class GradeQuestionDto {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}

export class ManualGradeDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GradeQuestionDto)
  grades: GradeQuestionDto[];
}
