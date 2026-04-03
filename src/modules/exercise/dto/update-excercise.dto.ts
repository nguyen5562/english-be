import { IsMongoId, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateExerciseDto {
  @IsMongoId()
  @IsOptional()
  courseId: string;

  @IsMongoId()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
