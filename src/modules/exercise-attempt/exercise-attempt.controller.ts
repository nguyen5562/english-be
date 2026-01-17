import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ExerciseAttemptService } from './exercise-attempt.service';
import {
  CreateExerciseAttemptDto,
  SectionAttemptDto,
} from './dto/create-exercise-attempt.dto';

@Controller('exercise-attempt')
export class ExerciseAttemptController {
  constructor(
    private readonly exerciseAttemptService: ExerciseAttemptService,
  ) {}

  /**
   * Tạo exercise attempt (nếu đã tồn tại thì trả về attempt cũ)
   * FE gọi khi user bắt đầu làm bài
   */
  @Post()
  async create(@Body(ValidationPipe) dto: CreateExerciseAttemptDto) {
    return this.exerciseAttemptService.createExerciseAttempt(dto);
  }

  /**
   * Submit 1 section
   * FE gọi mỗi lần user bấm "Submit section"
   */
  @Post(':attemptId/sections')
  async submitSection(
    @Param('attemptId') attemptId: string,
    @Body(ValidationPipe) sectionDto: SectionAttemptDto,
  ) {
    return this.exerciseAttemptService.submitSection(attemptId, sectionDto);
  }

  /**
   * Lấy danh sách tất cả attempt của user
   * Chỉ trả exerciseId + sectionId + tries + score
   */
  @Get('myattempt/:userId')
  async getMyAttempts(@Param('userId') userId: string) {
    return this.exerciseAttemptService.getUserAttemptsSummary(userId);
  }

  @Get('exercise/:exerciseId')
  async getByExId(@Param('exerciseId') exerciseId: string) {
    return this.exerciseAttemptService.getByExerciseId(exerciseId);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.exerciseAttemptService.getByUserId(userId);
  }
}
