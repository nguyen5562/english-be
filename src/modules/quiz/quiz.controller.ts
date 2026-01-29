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
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SectionDto } from '../shared/section/dto/section.dto';
import { QuestionDto } from '../shared/question/dto/question.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // =======================
  // Quiz
  // =======================

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post()
  async createQuiz(@Body(ValidationPipe) createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id')
  async updateQuiz(
    @Param('id') id: string,
    @Body(ValidationPipe) updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.updateQuiz(id, updateQuizDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id')
  async deleteQuiz(@Param('id') id: string) {
    return this.quizService.deleteQuiz(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.quizService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.quizService.getAll();
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
    return this.quizService.addSection(id, section);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id/section/:sectionId')
  async updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body(ValidationPipe) section: SectionDto,
  ) {
    return this.quizService.updateSection(id, sectionId, section);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id/section/:sectionId')
  async removeSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.quizService.removeSection(id, sectionId);
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
    return this.quizService.addQuestion(id, sectionId, question);
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
    return this.quizService.updateQuestion(id, sectionId, questionId, question);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id/section/:sectionId/question/:questionId')
  async removeQuestion(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizService.removeQuestion(id, sectionId, questionId);
  }
}
