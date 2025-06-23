import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { LessonMaterialService } from './lesson-material.service';
import { CreateLessonMaterialDto } from './dto/create-lesson-material.dto';

@Controller()
export class LessonMaterialController {
  constructor(private readonly lessonMaterialService: LessonMaterialService) {}

  @EventPattern('lesson_material_created')
  async createLessonMaterial(@Payload() createDto: CreateLessonMaterialDto) {
    return this.lessonMaterialService.create(createDto);
  }

  @MessagePattern({ cmd: 'get-lesson-materials' })
  async getLessonMaterials(@Payload() data: { lessonId: number }) {
    return this.lessonMaterialService.findAllByLesson(data.lessonId);
  }
}
