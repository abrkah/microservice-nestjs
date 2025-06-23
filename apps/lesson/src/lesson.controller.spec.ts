import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

describe('LessonController', () => {
  let lessonController: LessonController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [LessonService],
    }).compile();

    lessonController = app.get<LessonController>(LessonController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lessonController.getHello()).toBe('Hello World!');
    });
  });
});
