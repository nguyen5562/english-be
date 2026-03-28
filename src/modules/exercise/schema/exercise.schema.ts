import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import {
  SectionSchema,
  Section,
} from '../../../modules/shared/section/schema/section.schema';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: false, default: null })
  unitId?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [SectionSchema], default: [] })
  sections: Section[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
