import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Post()
  create(@Body(ValidationPipe) createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.unitService.findByCourseId(courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, updateUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
