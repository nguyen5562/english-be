import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
  @IsMongoId()
  @IsOptional()
  courseId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  timeLimit: number;
}
