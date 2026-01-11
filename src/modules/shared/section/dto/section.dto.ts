import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionDto } from '../../question/dto/question.dto';
import {
  SECTION_TYPE_SYSTEM,
  QUESTION_TYPE_SYSTEM,
} from '../../../../consts/system.const';

export class SectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

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

  @IsString()
  @IsOptional()
  passage: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(SECTION_TYPE_SYSTEM)
  sectionType: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(QUESTION_TYPE_SYSTEM)
  questionType: string;

  @IsArray()
  @IsNotEmpty()
  questions: QuestionDto[];
}
