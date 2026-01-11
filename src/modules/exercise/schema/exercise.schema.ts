import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Section, SectionSchema } from '../../section/schema/section.schema';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [SectionSchema], default: [] })
  sections: Section[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
