import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizAttempt, QuizAttemptSchema } from './schema/quiz-attempt.schema';
import { QuizModule } from '../quiz/quiz.module';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
    QuizModule,
  ],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}
