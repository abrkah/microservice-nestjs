import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
// course.service.ts

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  createCourse(dto: CreateCourseDto) {
    const course = this.courseRepository.create(dto);
    return this.courseRepository.save(course);
  }

  findAll() {
    return this.courseRepository.find({
      relations: ['lessons'], // optional if needed
    });
  }

  findOne(id: number) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'], // optional if needed
    });
  }
}
