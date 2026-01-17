import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AnswerDto } from '../../../modules/shared/answer/dto/answer.dto';

export class QuizAttemptDto {
  @IsMongoId()
  @IsNotEmpty()
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}

export class SubmitAttemptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @IsNotEmpty()
  answers: AnswerDto[];
}
