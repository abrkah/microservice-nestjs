import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: '*', // You can specify domains here (e.g., ['http://localhost:4200'])
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`🚀 API Gateway is running on: http://localhost:3000`);
}
bootstrap();
