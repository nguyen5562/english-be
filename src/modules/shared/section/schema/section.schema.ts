import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  Question,
  QuestionSchema,
} from '../../question/schema/question.schema';

@Schema({ _id: true })
export class Section {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  audioUrl: string;

  @Prop()
  videoUrl: string;

  @Prop()
  imageUrl: string;

  @Prop()
  wordBank: string[];

  @Prop()
  passage: string;

  @Prop({ required: true })
  sectionType: string;

  @Prop({ required: true })
  questionType: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
