import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, SubDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async createLesson(@Body(ValidationPipe) createLessonDto: CreateLessonDto) {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Put(':id')
  async updateLesson(
    @Param('id') id: string,
    @Body(ValidationPipe) updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.updateLesson(id, updateLessonDto);
  }

  @Post(':id/slide')
  async addSlide(@Param('id') id: string, @Body(ValidationPipe) slide: SubDto) {
    return this.lessonService.addSlide(id, slide);
  }

  @Put(':id/slide/:slideId')
  async updateSlide(
    @Param('id') id: string,
    @Param('slideId') slideId: string,
    @Body(ValidationPipe) slide: SubDto,
  ) {
    return this.lessonService.updateSlide(id, slideId, slide);
  }

  @Delete(':id/slide/:slideId')
  async removeSlide(
    @Param('id') id: string,
    @Param('slideId') slideId: string,
  ) {
    return this.lessonService.removeSlide(id, slideId);
  }

  @Post(':id/video')
  async addVideo(@Param('id') id: string, @Body(ValidationPipe) video: SubDto) {
    return this.lessonService.addVideo(id, video);
  }

  @Put(':id/video/:videoId')
  async updateVideo(
    @Param('id') id: string,
    @Param('videoId') videoId: string,
    @Body(ValidationPipe) video: SubDto,
  ) {
    return this.lessonService.updateVideo(id, videoId, video);
  }

  @Delete(':id/video/:videoId')
  async removeVideo(
    @Param('id') id: string,
    @Param('videoId') videoId: string,
  ) {
    return this.lessonService.removeVideo(id, videoId);
  }

  @Post(':id/reference')
  async addReference(
    @Param('id') id: string,
    @Body(ValidationPipe) reference: SubDto,
  ) {
    return this.lessonService.addReference(id, reference);
  }

  @Put(':id/reference/:referenceId')
  async updateReference(
    @Param('id') id: string,
    @Param('referenceId') referenceId: string,
    @Body(ValidationPipe) reference: SubDto,
  ) {
    return this.lessonService.updateReference(id, referenceId, reference);
  }

  @Delete(':id/reference/:referenceId')
  async removeReference(
    @Param('id') id: string,
    @Param('referenceId') referenceId: string,
  ) {
    return this.lessonService.removeReference(id, referenceId);
  }

  @Get(':courseId')
  async getLessonByCourseId(@Param('courseId') courseId: string) {
    return this.lessonService.getLessonByCoureId(courseId);
  }

  @Get()
  async getAllLessons() {
    return await this.lessonService.getAllLessons();
  }

  @Delete(':id')
  async deleteLesson(@Param('id') id: string) {
    return await this.lessonService.deleteLesson(id);
  }
}
