import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schema/exercise.schema';
import { Model } from 'mongoose';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<ExerciseDocument>,
  ) {}

  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    const newExercise = await this.exerciseModel.create(createExerciseDto);
    return newExercise;
  }

  async getAll(): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find();

    if (!exercises || exercises.length === 0)
      throw new NotFoundException('Không tìm thấy bài tập nào');
    return exercises;
  }
}
