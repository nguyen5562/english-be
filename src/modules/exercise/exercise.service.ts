import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';
import { Model, Types } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-excercise.dto';
import { SectionDto } from '../shared/section/dto/section.dto';
import { buildSet } from '../../utils/build-set';
import { QuestionDto } from '../shared/question/dto/question.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
  ) {}

  // =======================
  // Exercise
  // =======================

  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    const existed = await this.exerciseModel.findOne({
      title: createExerciseDto.title,
    });
    if (existed) throw new BadRequestException('Tiêu đề bài tập đã tồn tại');

    const newExercise = await this.exerciseModel.create({
      ...createExerciseDto,
      courseId: new Types.ObjectId(createExerciseDto.courseId),
    });
    return newExercise;
  }

  async updateExercise(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const existed = await this.exerciseModel.exists({
      _id: { $ne: id },
      title: updateExerciseDto.title,
    });
    if (existed) throw new BadRequestException('Tiêu đề bài tập đã tồn tại');

    const updatedExercise = await this.exerciseModel.findByIdAndUpdate(
      id,
      updateExerciseDto,
      { new: true },
    );
    if (!updatedExercise) throw new NotFoundException('Không tìm thấy bài tập');
    return updatedExercise;
  }

  async deleteExercise(id: string): Promise<void> {
    const deletedExercise = await this.exerciseModel.findByIdAndDelete(id);
    if (!deletedExercise) throw new NotFoundException('Không tìm thấy bài tập');
  }

  async getAll(): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find();

    if (!exercises || exercises.length === 0)
      throw new NotFoundException('Không tìm thấy bài tập nào');
    return exercises;
  }

  async getById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id);
    if (!exercise) throw new NotFoundException('Không tìm thấy bài tập này');
    return exercise;
  }

  // =======================
  // Section
  // =======================

  async addSection(id: string, section: SectionDto): Promise<Exercise> {
    const existed = await this.exerciseModel.exists({
      _id: id,
      'sections.title': section.title,
    });
    if (existed) {
      throw new BadRequestException('Tiêu đề section đã tồn tại');
    }

    const exercise = await this.exerciseModel.findByIdAndUpdate(
      id,
      { $push: { sections: section } },
      { new: true },
    );
    if (!exercise) throw new NotFoundException('Không tìm thấy bài tập');
    return exercise;
  }

  async updateSection(
    id: string,
    sectionId: string,
    section: SectionDto,
  ): Promise<Exercise> {
    const existed = await this.exerciseModel.exists({
      _id: id,
      sections: {
        $elemMatch: {
          _id: { $ne: sectionId },
          title: section.title,
        },
      },
    });
    if (existed) {
      throw new BadRequestException('Tiêu đề section đã tồn tại');
    }

    const set = buildSet('sections.$.', section);

    const exercise = await this.exerciseModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $set: set },
      { new: true },
    );
    if (!exercise)
      throw new NotFoundException('Không tìm thấy bài tập hoặc phần bài tập');
    return exercise;
  }

  async removeSection(id: string, sectionId: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findByIdAndUpdate(
      id,
      { $pull: { sections: { _id: sectionId } } },
      { new: true },
    );
    if (!exercise)
      throw new NotFoundException('Không tìm thấy bài tập hoặc phần bài tập');
    return exercise;
  }

  // =======================
  // Question
  // =======================

  async addQuestion(
    id: string,
    sectionId: string,
    question: QuestionDto,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $push: { 'sections.$.questions': question } },
      { new: true },
    );
    if (!exercise)
      throw new NotFoundException('Không tìm thấy bài tập hoặc phần bài tập');
    return exercise;
  }

  async updateQuestion(
    id: string,
    sectionId: string,
    questionId: string,
    question: QuestionDto,
  ): Promise<Exercise> {
    const set = buildSet('sections.$[s].questions.$[q].', question);

    const exercise = await this.exerciseModel.findOneAndUpdate(
      { _id: id },
      { $set: set },
      {
        new: true,
        arrayFilters: [{ 's._id': sectionId }, { 'q._id': questionId }],
      },
    );
    if (!exercise)
      throw new NotFoundException(
        'Không tìm thấy bài tập / phần bài tập / câu hỏi',
      );
    return exercise;
  }

  async removeQuestion(
    id: string,
    sectionId: string,
    questionId: string,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findOneAndUpdate(
      { _id: id, 'sections._id': sectionId },
      { $pull: { 'sections.$.questions': { _id: questionId } } },
      { new: true },
    );
    if (!exercise)
      throw new NotFoundException(
        'Không tìm thấy bài tập / phần bài tập / câu hỏi',
      );
    return exercise;
  }
}
