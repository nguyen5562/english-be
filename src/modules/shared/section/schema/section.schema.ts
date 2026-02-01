import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  Question,
  QuestionSchema,
} from '../../question/schema/question.schema';

@Schema({ _id: true })
export class Section {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  audioUrl: string;

  @Prop({ default: null })
  videoUrl: string;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  wordBank: string[];

  @Prop({ default: null })
  passage: string;

  @Prop({ required: true })
  sectionType: string;

  @Prop({ required: true })
  questionType: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
