import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule); // Create HTTP server

  await app.listen(3000); // Listen on port 3000 (or any port you want)
  console.log('✅ API Gateway running on http://localhost:3000');
}
bootstrap();
