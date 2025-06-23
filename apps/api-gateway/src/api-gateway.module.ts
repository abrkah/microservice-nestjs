import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUESTIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'questions_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ANSWERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'answers_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'COURSE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'course_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'LESSON_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'lesson_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'LESSON_MATERIAL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'lesson_material_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule {}
