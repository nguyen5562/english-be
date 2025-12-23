import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @Post()
  async createCourse(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @Put(':id')
  async updateCourse(
    @Param(':id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @Delete(':id')
  async deleteCourse(@Param(':id') id: string) {
    await this.courseService.deleteCourse(id);
  }

  @Get()
  async getAllCourse() {
    return this.courseService.getAllCourse();
  }

  @Get(':id')
  async getCourseById(@Param(':id') id: string) {
    return this.courseService.getCourseById(id);
  }
}
