import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  answer: string[];
}
