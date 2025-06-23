import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller()
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @EventPattern('answer_created')
  createAnswer(@Payload() dto: CreateAnswerDto) {
    return this.answersService.createAnswer(dto);
  }

  @MessagePattern({ cmd: 'get-all-answers' })
  getAllAnswers(@Payload() data: { questionId: number }) {
    return this.answersService.getAllAnswers(data.questionId);
  }
}
