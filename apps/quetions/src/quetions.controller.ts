import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionsService } from './quetions.service'; 
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @EventPattern('question_created')
  createQuestions(@Payload() dto: CreateQuestionDto) {
    return this.questionsService.createQuestions(dto);
  }

  @MessagePattern({ cmd: 'get-all-questions' })
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @MessagePattern({ cmd: 'get-question-by-id' })
  getQuestionById(@Payload() id: number) {
    return this.questionsService.getQuestionById(id);
  }
}
