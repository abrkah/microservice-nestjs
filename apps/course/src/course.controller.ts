import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // 🔁 Create a course using Event Pattern (fire-and-forget)
  @EventPattern('course_created')
  async createCourse(@Payload() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  // 📨 Get all courses using Message Pattern (returns a value)
  @MessagePattern({ cmd: 'get-all-courses' })
  async getAllCourses() {
    return this.courseService.findAll();
  }

  // 📨 Get a single course by ID
  @MessagePattern({ cmd: 'get-course-by-id' })
  async getCourseById(@Payload() data: { id: number }) {
    return this.courseService.findOne(data.id);
  }
}
