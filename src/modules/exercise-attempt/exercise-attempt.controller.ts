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
  ExerciseAttemptDto,
  SectionAttemptDto,
} from './dto/exercise-attempt.dto';

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
  async create(@Body(ValidationPipe) dto: ExerciseAttemptDto) {
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
  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return this.exerciseAttemptService.getAttemptsSummaryByUserId(userId);
  }

  @Get('exercise/:exerciseId')
  async getByExId(@Param('exerciseId') exerciseId: string) {
    return this.exerciseAttemptService.getAttemptsSummaryByExerciseId(
      exerciseId,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.exerciseAttemptService.getById(id);
  }

  // @Get('exercise/:exerciseId')
  // async getByExId(@Param('exerciseId') exerciseId: string) {
  //   return this.exerciseAttemptService.getByExerciseId(exerciseId);
  // }

  // @Get('user/:userId')
  // async getByUserId(@Param('userId') userId: string) {
  //   return this.exerciseAttemptService.getByUserId(userId);
  // }
}
