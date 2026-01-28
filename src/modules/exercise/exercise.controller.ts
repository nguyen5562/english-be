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
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-excercise.dto';
import { SectionDto } from '../shared/section/dto/section.dto';
import { QuestionDto } from '../shared/question/dto/question.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  // =======================
  // Exercise
  // =======================

  @Post()
  async createExercise(
    @Body(ValidationPipe) createExerciseDto: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Put(':id')
  async updateExercise(
    @Param('id') id: string,
    @Body(ValidationPipe) updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.updateExercise(id, updateExerciseDto);
  }

  @Delete(':id')
  async deleteExercise(@Param('id') id: string) {
    return this.exerciseService.deleteExercise(id);
  }

  @Get()
  async getAll() {
    return this.exerciseService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.exerciseService.getById(id);
  }

  // =======================
  // Section
  // =======================

  @Post(':id/section')
  async addSection(
    @Param('id') id: string,
    @Body(ValidationPipe) section: SectionDto,
  ) {
    return this.exerciseService.addSection(id, section);
  }

  @Put(':id/section/:sectionId')
  async updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body(ValidationPipe) section: SectionDto,
  ) {
    return this.exerciseService.updateSection(id, sectionId, section);
  }

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

  @Post(':id/section/:sectionId/question')
  async addQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body(ValidationPipe) question: QuestionDto,
  ) {
    return this.exerciseService.addQuestion(id, sectionId, question);
  }

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

  @Delete(':id/section/:sectionId/question/:questionId')
  async removeQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.exerciseService.removeQuestion(id, sectionId, questionId);
  }
}
