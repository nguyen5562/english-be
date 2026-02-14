import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizAttempt, QuizAttemptDocument } from './schema/quiz-attempt.schema';
import { Model, Types } from 'mongoose';
import { QuizService } from '../quiz/quiz.service';
import { QuizAttemptDto, SubmitAttemptDto } from './dto/quiz-attempt.dto';
import { AnswerDto } from '../shared/answer/dto/answer.dto';
import { Question } from '../shared/question/schema/question.schema';

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: Model<QuizAttemptDocument>,

    private readonly quizService: QuizService,
  ) {}

  async createQuizAttempt(dto: QuizAttemptDto): Promise<QuizAttempt> {
    const { quizId, userId } = dto;

    const existed = await this.quizAttemptModel.findOne({
      quizId,
      userId,
    });

    if (existed) return existed;

    const quizAttempt = await this.quizAttemptModel.create({
      quizId: new Types.ObjectId(quizId),
      userId: new Types.ObjectId(userId),
    });
    return quizAttempt;
  }

  async submitQuiz(
    quizAttemptId: string,
    submitDto: SubmitAttemptDto,
  ): Promise<QuizAttempt> {
    // 1. Lấy attempt
    const attempt = await this.quizAttemptModel.findById(quizAttemptId);

    if (!attempt) {
      throw new NotFoundException('Không tìm thấy bài làm quiz');
    }

    if (attempt.status !== 'in_progress') {
      throw new BadRequestException('Quiz đã được nộp hoặc đã hết hạn');
    }

    // 2. Lấy quiz (có sections)
    const quiz = await this.quizService.getById(attempt.quizId.toString());

    if (!quiz) {
      throw new NotFoundException('Không tìm thấy quiz');
    }

    // 3. Flatten toàn bộ questions từ sections
    const allQuestions = (quiz.sections ?? []).flatMap(
      (section) => section.questions ?? [],
    );

    // 4. Tạo set questionId hợp lệ
    const validQuestionIds = new Set(allQuestions.map((q) => q._id.toString()));

    // 5. Lọc answer hợp lệ
    const filteredAnswers = (submitDto.answers ?? []).filter((answer) =>
      validQuestionIds.has(answer.questionId),
    );

    // 6. Chống trùng question
    const questionIds = filteredAnswers.map((a) => a.questionId);
    const uniqueQuestionIds = new Set(questionIds);

    if (uniqueQuestionIds.size !== questionIds.length) {
      throw new BadRequestException('Có câu hỏi bị trả lời nhiều lần');
    }

    // 7. Chuẩn hoá answer để lưu DB
    const storedAnswers = filteredAnswers.map((answer) => ({
      questionId: new Types.ObjectId(answer.questionId),
      answer: answer.answer ?? [],
    }));

    // 8. Chấm điểm
    const totalScore = this.calculateQuizScore(allQuestions, filteredAnswers);

    // 9. Update attempt
    attempt.answers = storedAnswers;
    attempt.totalScore = totalScore;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();

    await attempt.save();
    return attempt;
  }

  private calculateQuizScore(
    questions: Question[],
    answers: AnswerDto[],
  ): number {
    let score = 0;

    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      if (this.isCorrect(question.correctAnswer ?? [], answer.answer ?? [])) {
        score += question.point ?? 0;
      }
    }

    return score;
  }

  private isCorrect(correctAnswer: string[], userAnswer: string[]): boolean {
    if (correctAnswer.length !== userAnswer.length) return false;

    // strict order comparison
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] !== userAnswer[i]) {
        return false;
      }
    }

    return true;
  }

  async getByQuizId(quizId: string): Promise<QuizAttempt[]> {
    const attempts = await this.quizAttemptModel
      .find({ quizId })
      .sort({ totalScore: -1 });
    return attempts;
  }

  async getByUserId(userId: string): Promise<QuizAttempt[]> {
    const attempts = await this.quizAttemptModel.find({ userId });
    return attempts;
  }

  async getById(id: string): Promise<QuizAttempt> {
    const attempt = await this.quizAttemptModel.findById(id);
    if (!attempt) throw new NotFoundException();
    return attempt;
  }

  async getAttemptsSummaryByUserId(userId: string): Promise<QuizAttempt[]> {
    return this.quizAttemptModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 1,
          attemptId: '$_id',
          quizId: 1,
          userId: 1,
          status: 1,
          answers: 1,
          totalScore: 1,
          startedAt: 1,
          submittedAt: 1,
          answeredCount: {
            $size: {
              $ifNull: ['$answers', []],
            },
          },
        },
      },
      {
        $sort: {
          startedAt: -1,
        },
      },
    ]);
  }

  async getAttemptsSummaryByQuizId(quizId: string): Promise<QuizAttempt[]> {
    return this.quizAttemptModel.aggregate([
      {
        $match: {
          quizId: new Types.ObjectId(quizId),
        },
      },
      {
        $project: {
          _id: 1,
          attemptId: '$_id',
          quizId: 1,
          userId: 1,
          status: 1,
          answers: 1,
          totalScore: 1,
          startedAt: 1,
          submittedAt: 1,
          answeredCount: {
            $size: {
              $ifNull: ['$answers', []],
            },
          },
        },
      },
      {
        $sort: {
          startedAt: -1,
        },
      },
    ]);
  }
}
