import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LessonMaterial } from './entities/lesson-material.entity'; 
import { LessonMaterialService } from './lesson-material.service'; 
import { LessonMaterialController } from './lesson-material.controller'; 

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
        entities: [LessonMaterial],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([LessonMaterial]),
  ],
  controllers: [LessonMaterialController],
  providers: [LessonMaterialService],
})
export class LessonMaterialsModule {}
