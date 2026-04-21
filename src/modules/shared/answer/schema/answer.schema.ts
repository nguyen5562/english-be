import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class Answer {
  @Prop({ required: true })
  questionId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  answer: string[];

  @Prop({ required: false })
  teacherScore?: number;

  @Prop({ required: false })
  teacherFeedback?: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
