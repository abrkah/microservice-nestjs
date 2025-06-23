import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Question } from './entities/question.entity';
import { QuestionsService } from './quetions.service';
import { QuestionsController } from './quetions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // loads .env and makes ConfigService available app-wide
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: +(process.env.DATABASE_PORT || 5432),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'abrkah@1441',
        database: process.env.DATABASE_NAME || 'microservice',
        entities: [Question],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Question]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
