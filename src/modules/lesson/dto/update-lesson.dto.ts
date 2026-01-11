import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsMongoId()
  @IsOptional()
  courseId?: string;
}
