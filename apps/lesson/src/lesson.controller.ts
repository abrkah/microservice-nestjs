import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { LessonService } from './lesson.service'; 
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @EventPattern('lesson_created')
  async handleCreateLesson(@Payload() dto: CreateLessonDto) {
    return this.lessonService.createLesson(dto);
  }

  @MessagePattern({ cmd: 'get-all-lessons' })
  async handleGetAllLessons() {
    return this.lessonService.getAllLessons();
  }

  @MessagePattern({ cmd: 'get-lessons-by-course' })
  async handleGetLessonsByCourse(@Payload() data: { courseId: number }) {
    return this.lessonService.getLessonsByCourse(data.courseId);
  }
}
