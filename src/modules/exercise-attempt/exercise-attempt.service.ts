import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ExerciseAttempt,
  ExerciseAttemptDocument,
} from './schema/exercise-attempt.schema';
import { Model, Types } from 'mongoose';
import {
  ExerciseAttemptDto,
  SectionAttemptDto,
} from './dto/exercise-attempt.dto';
import { ExerciseService } from '../exercise/exercise.service';
import { AnswerDto } from '../shared/answer/dto/answer.dto';
import { Question } from '../shared/question/schema/question.schema';

@Injectable()
export class ExerciseAttemptService {
  constructor(
    @InjectModel(ExerciseAttempt.name)
    private readonly exerciseAttemptModel: Model<ExerciseAttemptDocument>,

    private readonly exerciseService: ExerciseService,
  ) {}

  async createExerciseAttempt(
    createExerciseAttemptDto: ExerciseAttemptDto,
  ): Promise<ExerciseAttempt> {
    const { exerciseId, userId } = createExerciseAttemptDto;

    const existed = await this.exerciseAttemptModel.findOne({
      exerciseId,
      userId,
    });

    if (existed) return existed;

    const exerciseAttempt = await this.exerciseAttemptModel.create({
      exerciseId: new Types.ObjectId(exerciseId),
      userId: new Types.ObjectId(userId),
    });

    return exerciseAttempt;
  }

  async submitSection(
    exerciseAttemptId: string,
    sectionDto: SectionAttemptDto,
  ): Promise<ExerciseAttempt> {
    const attempt = await this.exerciseAttemptModel.findById(exerciseAttemptId);
    if (!attempt) {
      throw new NotFoundException('Không tìm thấy câu trả lời của bài tập này');
    }

    const exercise = await this.exerciseService.getById(
      attempt.exerciseId.toString(),
    );
    const section = exercise.sections.find(
      (s) => s._id.toString() === sectionDto.sectionId,
    );
    if (!section) {
      throw new NotFoundException('Không tìm thấy phần bài tập này');
    }

    const sectionAttempt = attempt.sectionAttempts.find(
      (s) => s.sectionId.toString() === sectionDto.sectionId,
    );

    const validQuestionIds = new Set(
      (section.questions ?? []).map((question) => question._id.toString()),
    );
    const filteredAnswers = (sectionDto.answers ?? []).filter((answer) =>
      validQuestionIds.has(answer.questionId),
    );
    const storedAnswers = filteredAnswers.map((answer) => ({
      questionId: new Types.ObjectId(answer.questionId),
      answer: answer.answer ?? [],
    }));

    const sectionScore = this.calculateSectionScore(
      section.questions,
      filteredAnswers,
    );

    if (!sectionAttempt) {
      attempt.sectionAttempts.push({
        sectionId: new Types.ObjectId(sectionDto.sectionId),
        tries: 1,
        score: sectionScore,
        answers: storedAnswers,
      });
    } else {
      sectionAttempt.tries += 1;
      sectionAttempt.score = sectionScore;
      sectionAttempt.answers = storedAnswers;
    }

    attempt.totalScore = attempt.sectionAttempts.reduce(
      (total, current) => total + (current.score ?? 0),
      0,
    );

    await attempt.save();
    return attempt;
  }

  private calculateSectionScore(
    questions: Question[],
    answers: AnswerDto[],
  ): number {
    let score = 0;
    const questionMap = new Map(
      (questions ?? []).map((question) => [question._id.toString(), question]),
    );

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

  async getByExerciseId(exerciseId: string): Promise<ExerciseAttempt[]> {
    const attempts = await this.exerciseAttemptModel
      .find({ exerciseId })
      .sort({ totalScore: -1 });
    return attempts;
  }

  async getByUserId(userId: string): Promise<ExerciseAttempt[]> {
    const attempts = await this.exerciseAttemptModel.find({ userId });
    return attempts;
  }

  async getById(id: string): Promise<ExerciseAttempt> {
    const attempt = await this.exerciseAttemptModel.findById(id);
    if (!attempt) throw new NotFoundException();
    return attempt;
  }

  async getAttemptsSummaryByUserId(userId: string): Promise<ExerciseAttempt[]> {
    return this.exerciseAttemptModel.aggregate<ExerciseAttempt>([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $project: {
          _id: 1,
          exerciseId: 1,
          userId: 1,
          sectionAttempts: 1,
          totalScore: 1,
        },
      },
    ]);
  }

  async getAttemptsSummaryByExerciseId(
    exerciseId: string,
  ): Promise<ExerciseAttempt[]> {
    return this.exerciseAttemptModel.aggregate([
      {
        $match: {
          exerciseId: new Types.ObjectId(exerciseId),
        },
      },
      {
        $project: {
          _id: 1,
          exerciseId: 1,
          userId: 1,
          sectionAttempts: 1,
          totalScore: 1,
        },
      },
    ]);
  }
}
