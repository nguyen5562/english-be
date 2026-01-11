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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async createCourse(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.courseService.deleteCourse(id);
  }

  @Get()
  async getAllCourse() {
    return this.courseService.getAllCourse();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }
}
