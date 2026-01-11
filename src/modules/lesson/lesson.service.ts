import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './schema/lesson.schema';
import { Model, Types } from 'mongoose';
import { CreateLessonDto, SubDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const newLesson = await this.lessonModel.create({
      ...createLessonDto,
      courseId: new Types.ObjectId(createLessonDto.courseId),
    });
    return newLesson;
  }

  async updateLesson(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    const updatedLesson = await this.lessonModel.findByIdAndUpdate(
      id,
      updateLessonDto,
      { new: true, runValidators: true },
    );

    if (!updatedLesson) throw new NotFoundException('Không tìm thấy bài học');
    return updatedLesson;
  }

  async addSlide(id: string, slide: SubDto): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $push: { slides: slide } },
      { new: true },
    );
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');
    return lesson;
  }

  async updateSlide(
    id: string,
    slideId: string,
    slide: SubDto,
  ): Promise<Lesson> {
    const lesson = await this.lessonModel.findOneAndUpdate(
      { _id: id, 'slides._id': slideId },
      { $set: { 'slides.$.title': slide.title, 'slides.$.url': slide.url } },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException('Không tìm thấy bài học hoặc slide');
    return lesson;
  }

  async removeSlide(id: string, slideId: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $pull: { slides: { _id: slideId } } },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException('Không tìm thấy bài học hoặc slide');
    return lesson;
  }

  async addVideo(id: string, video: SubDto): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $push: { videos: video } },
      { new: true },
    );
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');
    return lesson;
  }

  async updateVideo(
    id: string,
    videoId: string,
    video: SubDto,
  ): Promise<Lesson> {
    const lesson = await this.lessonModel.findOneAndUpdate(
      { _id: id, 'videos._id': videoId },
      { $set: { 'videos.$.title': video.title, 'videos.$.url': video.url } },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException('Không tìm thấy bài học hoặc video');
    return lesson;
  }

  async removeVideo(id: string, videoId: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $pull: { videos: { _id: videoId } } },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException('Không tìm thấy bài học hoặc video');
    return lesson;
  }

  async addReference(id: string, reference: SubDto): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $push: { references: reference } },
      { new: true },
    );
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');
    return lesson;
  }

  async updateReference(
    id: string,
    referenceId: string,
    reference: SubDto,
  ): Promise<Lesson> {
    const lesson = await this.lessonModel.findOneAndUpdate(
      { _id: id, 'references._id': referenceId },
      {
        $set: {
          'references.$.title': reference.title,
          'references.$.url': reference.url,
        },
      },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException(
        'Không tìm thấy bài học hoặc tài liệu tham khảo',
      );
    return lesson;
  }

  async removeReference(id: string, referenceId: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      id,
      { $pull: { references: { _id: referenceId } } },
      { new: true },
    );
    if (!lesson)
      throw new NotFoundException(
        'Không tìm thấy bài học hoặc tài liệu tham khảo',
      );
    return lesson;
  }

  async getLessonByCoureId(courseId: string): Promise<Lesson[]> {
    const lessons = await this.lessonModel.find({ courseId: courseId });

    if (!lessons || lessons.length === 0)
      throw new NotFoundException('Không tìm thấy bài học của khóa học này');
    return lessons;
  }

  async getLessonById(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id);
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học');
    return lesson;
  }

  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonModel.find();
  }

  async deleteLesson(id: string): Promise<void> {
    const deletedLesson = await this.lessonModel.findByIdAndDelete(id);
    if (!deletedLesson) throw new NotFoundException('Không tìm thấy bài học');
  }
}
