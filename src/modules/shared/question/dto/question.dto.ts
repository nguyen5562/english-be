import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  correctAnswer: string[];

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  point: number;

  @IsString()
  @IsOptional()
  audioUrl: string;

  @IsString()
  @IsOptional()
  videoUrl: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  wordBank: string[];
}
