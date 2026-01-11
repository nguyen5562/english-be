import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true })
export class Question {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  options: string[];

  // @Prop()
  // correctAnswer: string | string[];

  @Prop({ required: true })
  point: number;

  @Prop()
  audioUrl: string;

  @Prop()
  videoUrl: string;

  @Prop()
  imageUrl: string;

  @Prop()
  wordBank: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
