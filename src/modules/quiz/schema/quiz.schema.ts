import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Section,
  SectionSchema,
} from '../../../modules/shared/section/schema/section.schema';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [SectionSchema], default: [] })
  sections: Section[];

  @Prop({ required: true })
  timeLimit: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
