import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Inject,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateCourseDto } from './dto/create-course.dto'; 
import { CreateLessonDto } from './dto/create-lesson.dto'; 
import { CreateLessonMaterialDto } from './dto/create-lesson-material.dto'; 

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('QUESTIONS_SERVICE') private questionsClient: ClientProxy,
    @Inject('ANSWERS_SERVICE') private answersClient: ClientProxy,
    @Inject('COURSE_SERVICE') private courseClient: ClientProxy,
    @Inject('LESSON_SERVICE') private lessonClient: ClientProxy,
    @Inject('LESSON_MATERIAL_SERVICE')
    private lessonMaterialClient: ClientProxy,
  ) {}

  // === Questions & Answers ===

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionsClient.emit('question_created', dto);
  }

  @Get('questions')
  async getQuestions() {
    return this.questionsClient.send({ cmd: 'get-all-questions' }, '');
  }

  @Post('questions/:questionId/answers')
  async createAnswer(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateAnswerDto,
  ) {
    dto.questionId = questionId;
    return this.answersClient.emit('answer_created', dto);
  }

  @Get('questions/:questionId/answers')
  async getAnswers(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.answersClient.send({ cmd: 'get-all-answers' }, { questionId });
  }

  // === Courses ===

  @Post('courses')
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseClient.emit('course_created', dto);
  }

  @Get('courses')
  async getCourses() {
    return this.courseClient.send({ cmd: 'get-all-courses' }, '');
  }

  // === Lessons ===

  @Post('courses/:courseId/lessons')
  async createLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() dto: CreateLessonDto,
  ) {
    dto.courseId = courseId;
    return this.lessonClient.emit('lesson_created', dto);
  }

  @Get('courses/:courseId/lessons')
  async getLessons(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.lessonClient.send({ cmd: 'get-all-lessons' }, { courseId });
  }

  // === Lesson Materials ===

  @Post('lessons/:lessonId/materials')
  async createLessonMaterial(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: CreateLessonMaterialDto,
  ) {
    dto.lessonId = lessonId;
    return this.lessonMaterialClient.emit('material_created', dto);
  }

  @Get('lessons/:lessonId/materials')
  async getLessonMaterials(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.lessonMaterialClient.send(
      { cmd: 'get-all-materials' },
      { lessonId },
    );
  }
}
