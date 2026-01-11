import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(@Body(ValidationPipe) createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get()
  async getAll() {
    return this.quizService.getAll();
  }
}
