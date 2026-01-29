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
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-excercise.dto';
import { SectionDto } from '../shared/section/dto/section.dto';
import { QuestionDto } from '../shared/question/dto/question.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  // =======================
  // Exercise
  // =======================

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post()
  async createExercise(
    @Body(ValidationPipe) createExerciseDto: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id')
  async updateExercise(
    @Param('id') id: string,
    @Body(ValidationPipe) updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.updateExercise(id, updateExerciseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id')
  async deleteExercise(@Param('id') id: string) {
    return this.exerciseService.deleteExercise(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.exerciseService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.exerciseService.getById(id);
  }

  // =======================
  // Section
  // =======================

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post(':id/section')
  async addSection(
    @Param('id') id: string,
    @Body(ValidationPipe) section: SectionDto,
  ) {
    return this.exerciseService.addSection(id, section);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id/section/:sectionId')
  async updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body(ValidationPipe) section: SectionDto,
  ) {
    return this.exerciseService.updateSection(id, sectionId, section);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id/section/:sectionId')
  async removeSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.exerciseService.removeSection(id, sectionId);
  }

  // =======================
  // Question
  // =======================

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post(':id/section/:sectionId/question')
  async addQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body(ValidationPipe) question: QuestionDto,
  ) {
    return this.exerciseService.addQuestion(id, sectionId, question);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id/section/:sectionId/question/:questionId')
  async updateQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('questionId') questionId: string,
    @Body(ValidationPipe) question: QuestionDto,
  ) {
    return this.exerciseService.updateQuestion(
      id,
      sectionId,
      questionId,
      question,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id/section/:sectionId/question/:questionId')
  async removeQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.exerciseService.removeQuestion(id, sectionId, questionId);
  }
}
