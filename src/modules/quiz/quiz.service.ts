import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<QuizDocument>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = await this.quizModel.create(createQuizDto);
    return newQuiz;
  }

  async getAll(): Promise<Quiz[]> {
    const quizzes = await this.quizModel.find();

    if (!quizzes || quizzes.length === 0)
      throw new NotFoundException('Không tìm thấy bài tập nào');
    return quizzes;
  }
}
