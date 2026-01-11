import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async createExercise(
    @Body(ValidationPipe) createExerciseDto: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Get()
  async getAll() {
    return this.exerciseService.getAll();
  }
}
