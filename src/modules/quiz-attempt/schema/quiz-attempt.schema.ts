import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import {
  Answer,
  AnswerSchema,
} from '../../../modules/shared/answer/schema/answer.schema';

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ timestamps: true })
export class QuizAttempt {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    enum: ['in_progress', 'submitted', 'expired'],
    default: 'in_progress',
  })
  status: string;

  @Prop({ required: true, default: Date.now })
  startedAt: Date;

  @Prop({ default: null })
  submittedAt: Date;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop({ default: 0 })
  totalScore: number;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
