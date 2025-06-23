import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LessonMaterial } from './entities/lesson-material.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLessonMaterialDto } from './dto/create-lesson-material.dto';

@Injectable()
export class LessonMaterialService {
  constructor(
    @InjectRepository(LessonMaterial)
    private readonly lessonMaterialRepository: Repository<LessonMaterial>,
  ) {}

  async create(createDto: CreateLessonMaterialDto): Promise<LessonMaterial> {
    const lessonMaterial = this.lessonMaterialRepository.create(createDto);
    return this.lessonMaterialRepository.save(lessonMaterial);
  }

  async findAllByLesson(lessonId: number): Promise<LessonMaterial[]> {
    return this.lessonMaterialRepository.find({ where: { lessonId } });
  }

  async findOne(id: number): Promise<LessonMaterial |null> {
    return this.lessonMaterialRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.lessonMaterialRepository.delete(id);
  }
}
