import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Answer } from './entities/answer.entity';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';

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
        entities: [Answer],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Answer]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
