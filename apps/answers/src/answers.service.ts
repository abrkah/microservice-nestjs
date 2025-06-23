import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity'; 
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepo: Repository<Answer>,
  ) {}

  async createAnswer(dto: CreateAnswerDto) {
    const answer = this.answerRepo.create(dto);
    return this.answerRepo.save(answer);
  }

  async getAllAnswers(questionId: number) {
    return this.answerRepo.find({ where: { questionId } });
  }
}
