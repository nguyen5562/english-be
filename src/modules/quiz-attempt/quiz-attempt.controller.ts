import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuizAttemptService } from './quiz-attempt.service';
import { QuizAttemptDto, SubmitAttemptDto } from './dto/quiz-attempt.dto';
import { ManualGradeDto } from '../shared/answer/dto/grade.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';

@Controller('quiz-attempt')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.STUDENT)
  @Post()
  async create(@Body(ValidationPipe) dto: QuizAttemptDto) {
    return this.quizAttemptService.createQuizAttempt(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.STUDENT)
  @Post(':attemptId')
  async submitQuiz(
    @Param('attemptId') attemptId: string,
    @Body(ValidationPipe) dto: SubmitAttemptDto,
  ) {
    return this.quizAttemptService.submitQuiz(attemptId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/grade')
  async manualGrade(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) dto: ManualGradeDto,
  ) {
    return this.quizAttemptService.manualGrade(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.quizAttemptService.getAttemptsSummaryByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('quiz/:quizId')
  async getByQuizId(@Param('quizId') quizId: string) {
    return this.quizAttemptService.getAttemptsSummaryByQuizId(quizId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.quizAttemptService.getById(id);
  }
}
