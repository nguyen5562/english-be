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
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post()
  async createCourse(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.courseService.deleteCourse(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCourse() {
    return this.courseService.getAllCourse();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }
}
