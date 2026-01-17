import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AnswerDto } from 'src/modules/shared/answer/dto/answer.dto';

export class SectionAttemptDto {
  @IsMongoId()
  @IsNotEmpty()
  sectionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @IsNotEmpty()
  answers: AnswerDto[];
}

export class CreateExerciseAttemptDto {
  @IsMongoId()
  @IsNotEmpty()
  exerciseId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}
