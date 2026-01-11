import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsMongoId()
  @IsOptional()
  courseId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
