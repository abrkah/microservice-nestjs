import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity'; 
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async createQuestions(dto: CreateQuestionDto) {
    const exists = await this.questionRepo.findOneBy({ title: dto.title });

    if (exists) {
      throw new ConflictException('Question title already exists');
    }

    try {
      const newQuestion = this.questionRepo.create(dto);
      await this.questionRepo.save(newQuestion);
      return newQuestion;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create question');
    }
  }

  async getAllQuestions() {
    return this.questionRepo.find();
  }

  async getQuestionById(id: number) {
    return this.questionRepo.findOneBy({ id });
  }
}
