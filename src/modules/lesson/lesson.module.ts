import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schema/lesson.schema';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
