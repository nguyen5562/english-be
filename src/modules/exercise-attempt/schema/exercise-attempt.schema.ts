import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  Answer,
  AnswerSchema,
} from '../../../modules/shared/answer/schema/answer.schema';

export type ExerciseAttemptDocument = ExerciseAttempt & Document;

// Schema SectionAttempt
@Schema({ _id: false })
export class SectionAttempt {
  @Prop({ required: true })
  sectionId: Types.ObjectId;

  @Prop({ default: 1 })
  tries: number;

  @Prop({ default: 0 })
  score: number;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];
}

export const SectionAttemptSchema =
  SchemaFactory.createForClass(SectionAttempt);

// Schema ExerciseAttempt
@Schema({ timestamps: true })
export class ExerciseAttempt {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [SectionAttemptSchema], default: [] })
  sectionAttempts: SectionAttempt[];

  @Prop({ default: 0 })
  totalScore: number;
}

export const ExerciseAttemptSchema =
  SchemaFactory.createForClass(ExerciseAttempt);
