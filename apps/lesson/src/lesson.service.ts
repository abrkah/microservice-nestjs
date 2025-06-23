import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<Lesson> {
    const lesson = this.lessonRepository.create(dto);
    return this.lessonRepository.save(lesson);
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return this.lessonRepository.find({ where: { courseId } });
  }

  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }
}
