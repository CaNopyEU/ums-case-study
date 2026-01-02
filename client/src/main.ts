import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8091;
  await app.listen(port);

  console.log(`Client HTTP API is running on port ${port}`);
  console.log(`Connected to gRPC server at ${process.env.GRPC_SERVER_URL || 'localhost:8081'}`);
}

bootstrap();
