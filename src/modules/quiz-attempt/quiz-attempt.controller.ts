import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { QuizAttemptService } from './quiz-attempt.service';
import { QuizAttemptDto, SubmitAttemptDto } from './dto/quiz-attempt.dto';

@Controller('quiz-attempt')
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  @Post()
  async create(@Body(ValidationPipe) dto: QuizAttemptDto) {
    return this.quizAttemptService.createQuizAttempt(dto);
  }

  @Post(':attemptId')
  async submitQuiz(
    @Param('attemptId') attemptId: string,
    @Body(ValidationPipe) dto: SubmitAttemptDto,
  ) {
    return this.quizAttemptService.submitQuiz(attemptId, dto);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.quizAttemptService.getAttemptsSummaryByUserId(userId);
  }

  @Get('quiz/:quizId')
  async getByQuizId(@Param('quizId') quizId: string) {
    return this.quizAttemptService.getAttemptsSummaryByQuizId(quizId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.quizAttemptService.getById(id);
  }
}
