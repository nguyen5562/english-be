import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class Question {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  options: string[];

  @Prop({ type: [String], default: [] })
  correctAnswer: string[];

  @Prop({ required: true })
  point: number;

  @Prop({ default: null })
  audioUrl: string;

  @Prop({ default: null })
  videoUrl: string;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  wordBank: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
