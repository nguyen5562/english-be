import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { Model, Types } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SectionDto } from '../shared/section/dto/section.dto';
import { buildSet } from '../../utils/build-set';
import { QuestionDto } from '../shared/question/dto/question.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<QuizDocument>,
  ) {}

  // =======================
  // Quiz
  // =======================

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = await this.quizModel.create({
      ...createQuizDto,
      courseId: new Types.ObjectId(createQuizDto.courseId),
    });
    return newQuiz;
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const updatedQuiz = await this.quizModel.findByIdAndUpdate(
      id,
      updateQuizDto,
      { new: true },
    );
    if (!updatedQuiz)
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    return updatedQuiz;
  }

  async deleteQuiz(id: string): Promise<void> {
    const deletedQuiz = await this.quizModel.findByIdAndDelete(id);
    if (!deletedQuiz)
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
  }

  async getAll(): Promise<Quiz[]> {
    const quizzes = await this.quizModel.find();

    if (!quizzes || quizzes.length === 0)
      throw new NotFoundException('Không tìm thấy bài kiểm tra nào');
    return quizzes;
  }

  async getById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new NotFoundException('Không tìm thấy bài tập này');
    return quiz;
  }

  // =======================
  // Section
  // =======================

  async addSection(id: string, section: SectionDto): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(
      id,
      { $push: { sections: section } },
      { new: true },
    );
    if (!quiz) throw new NotFoundException('Không tìm thấy bài kiểm tra');
    return quiz;
  }

  async updateSection(
    id: string,
    sectionId: string,
    section: SectionDto,
  ): Promise<Quiz> {
    const set = buildSet('sections.$.', section);

    const quiz = await this.quizModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $set: set },
      { new: true },
    );
    if (!quiz)
      throw new NotFoundException(
        'Không tìm thấy bài kiểm tra hoặc phần bài kiểm tra',
      );
    return quiz;
  }

  async removeSection(id: string, sectionId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(
      id,
      { $pull: { sections: { _id: sectionId } } },
      { new: true },
    );
    if (!quiz)
      throw new NotFoundException(
        'Không tìm thấy bài kiểm tra hoặc phần bài kiểm tra',
      );
    return quiz;
  }

  // =======================
  // Question
  // =======================

  async addQuestion(
    id: string,
    sectionId: string,
    question: QuestionDto,
  ): Promise<Quiz> {
    const quiz = await this.quizModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $push: { 'sections.$.questions': question } },
      { new: true },
    );
    if (!quiz)
      throw new NotFoundException(
        'Không tìm thấy bài kiểm tra hoặc phần bài kiểm tra',
      );
    return quiz;
  }

  async updateQuestion(
    id: string,
    sectionId: string,
    questionId: string,
    question: QuestionDto,
  ): Promise<Quiz> {
    const set = buildSet('sections.$[s].questions.$[q].', question);

    const quiz = await this.quizModel.findOneAndUpdate(
      { _id: id },
      { $set: set },
      {
        new: true,
        arrayFilters: [{ 's._id': sectionId }, { 'q._id': questionId }],
      },
    );
    if (!quiz)
      throw new NotFoundException(
        'Không tìm thấy bài kiểm tra / phần bài kiểm tra / câu hỏi',
      );
    return quiz;
  }

  async removeQuestion(
    id: string,
    sectionId: string,
    questionId: string,
  ): Promise<Quiz> {
    const quiz = await this.quizModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $pull: { 'sections.$.questions': { _id: questionId } } },
      { new: true },
    );
    if (!quiz)
      throw new NotFoundException(
        'Không tìm thấy bài kiểm tra / phần bài kiểm tra / câu hỏi',
      );
    return quiz;
  }
}
