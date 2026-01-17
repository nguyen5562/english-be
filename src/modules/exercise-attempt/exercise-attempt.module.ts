import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExerciseAttempt,
  ExerciseAttemptSchema,
} from './schema/exercise-attempt.schema';
import { ExerciseAttemptController } from './exercise-attempt.controller';
import { ExerciseAttemptService } from './exercise-attempt.service';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExerciseAttempt.name, schema: ExerciseAttemptSchema },
    ]),
    ExerciseModule,
  ],
  controllers: [ExerciseAttemptController],
  providers: [ExerciseAttemptService],
  exports: [ExerciseAttemptService],
})
export class ExerciseAttemptModule {}
