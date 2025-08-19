import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Inject,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateLessonMaterialDto } from './dto/create-lesson-material.dto';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { lastValueFrom } from 'rxjs';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('QUESTIONS_SERVICE') private questionsClient: ClientProxy,
    @Inject('ANSWERS_SERVICE') private answersClient: ClientProxy,
    @Inject('COURSE_SERVICE') private courseClient: ClientProxy,
    @Inject('LESSON_SERVICE') private lessonClient: ClientProxy,
    @Inject('LESSON_MATERIAL_SERVICE')
    private lessonMaterialClient: ClientProxy,

    // ✅ Inject Role & Permission Clients
    @Inject('ROLE_SERVICE') private roleClient: ClientProxy,
    @Inject('PERMISSION_SERVICE') private permissionClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  // === ✅ Authentication ===
  @Post('auth/signup')
  async signup(@Body() dto: any) {
    
    return lastValueFrom(this.authClient.send('auth_signup', dto));
  }

  @Post('auth/login')
  async login(@Body() payload: { email: string; password: string }) {
    console.log('API Gateway received auth DTO:', payload);
    return lastValueFrom(this.authClient.send('auth_login', payload));
  }

  @Post('auth/validate-token')
  async validateToken(@Body() payload: { token: string }) {
    return this.authClient.send('auth_validate_token', payload);
  }
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

  // === ✅ Roles ===
  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto) {
    return this.roleClient.emit({ cmd: 'create_role' }, dto);
  }

  @Get('roles')
  async getRoles() {
    return this.roleClient.send({ cmd: 'find_all_roles' }, '');
  }

  @Get('roles/:id')
  async getRole(@Param('id') id: string) {
    return this.roleClient.send({ cmd: 'find_one_role' }, id);
  }

  @Put('roles/:id')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleClient.send(
      { cmd: 'update_role' },
      { id, updateRoleDto: dto },
    );
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    return this.roleClient.send({ cmd: 'remove_role' }, id);
  }

  // === ✅ Permissions ===
  @Post('permissions')
  async createPermission(@Body() dto: CreatePermissionDto) {
    console.log('API Gateway received permission DTO:', dto);
    return this.permissionClient.emit({ cmd: 'create_permission' }, dto);
  }

  @Get('permissions')
  async getPermissions() {
    return this.permissionClient.send({ cmd: 'find_all_permissions' }, '');
  }

  @Get('permissions/:id')
  async getPermission(@Param('id') id: string) {
    return this.permissionClient.send({ cmd: 'find_one_permission' }, id);
  }

  @Put('permissions/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePermissionDto>,
  ) {
    // Change 'dto' to 'updateData' to match PermissionController expectation
    return this.permissionClient.send(
      { cmd: 'update_permission' },
      { id, updateData: dto }, // <-- key renamed here
    );
  }

  @Delete('permissions/:id')
  async deletePermission(@Param('id') id: string) {
    return this.permissionClient.send({ cmd: 'remove_permission' }, id);
  }
}
