import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from './schema/unit.schema';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<UnitDocument>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = new this.unitModel(createUnitDto);
    return unit.save();
  }

  async findAll(): Promise<Unit[]> {
    return this.unitModel.find().exec();
  }

  async findByCourseId(courseId: string): Promise<Unit[]> {
    return this.unitModel.find({ courseId }).sort({ order: 1 }).exec();
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitModel.findById(id).exec();
    if (!unit) {
      throw new NotFoundException('Không tìm thấy Unit này');
    }
    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const updatedUnit = await this.unitModel
      .findByIdAndUpdate(id, updateUnitDto, { new: true })
      .exec();
    if (!updatedUnit) {
      throw new NotFoundException('Không tìm thấy Unit này');
    }
    return updatedUnit;
  }

  async remove(id: string): Promise<void> {
    const result = await this.unitModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy Unit này');
    }
  }
}
