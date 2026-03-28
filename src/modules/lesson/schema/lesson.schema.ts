import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type LessonDocument = Lesson & Document;

// Schema Slide
@Schema({ _id: true })
export class Slide {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);

// Schema Video
@Schema({ _id: true })
export class Video {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

// Schema Reference
@Schema({ _id: true })
export class Reference {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;
}

export const ReferenceSchema = SchemaFactory.createForClass(Reference);

// Schema Lesson
@Schema({ timestamps: true })
export class Lesson {
  _id: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [SlideSchema], default: [] })
  slides: Slide[];

  @Prop({ type: [VideoSchema], default: [] })
  videos: Video[];

  @Prop({ type: [ReferenceSchema], default: [] })
  references: Reference[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
