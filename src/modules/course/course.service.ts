import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schema/course.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const checkCourse = await this.courseModel.findOne({
      $or: [{ name: createCourseDto.name }, { code: createCourseDto.code }],
    });

    if (checkCourse)
      throw new BadRequestException('Tên khóa học hoặc mã khóa học đã tồn tại');

    const newCourse = await this.courseModel.create(createCourseDto);
    return newCourse;
  }

  async getAllCourse(): Promise<Course[]> {
    return this.courseModel.find();
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const checkCourse = await this.courseModel.findOne({
      $or: [{ name: updateCourseDto.name }, { code: updateCourseDto.code }],
    });

    if (checkCourse)
      throw new BadRequestException('Tên khóa học hoặc mã khóa học đã tồn tại');

    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      updateCourseDto,
      { new: true },
    );

    if (!updatedCourse) throw new NotFoundException('Không tìm thấy khóa học');
    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Không tìm thấy khóa học');
  }
}
