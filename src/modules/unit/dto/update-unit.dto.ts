import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUnitDto {
  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
