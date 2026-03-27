import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({ timestamps: true })
export class Unit {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true, default: 0 })
  order: number;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
