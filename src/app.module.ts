import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { databaseConfig } from './configs/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ExerciseAttemptModule } from './modules/exercise-attempt/exercise-attempt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: databaseConfig.uri,
        connectionFactory: (connection: Connection) => {
          console.log('Mongoose connected to the database');
          return connection;
        },
      }),
    }),
    AuthModule,
    UserModule,
    CourseModule,
    LessonModule,
    ExerciseModule,
    QuizModule,
    ExerciseAttemptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
