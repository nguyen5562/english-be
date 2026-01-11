import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsOptional()
  options: string[];

  @IsOptional()
  correctAnswer: string | string[];

  @IsNumber()
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
  @IsOptional()
  wordBank: string[];
}
