import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InitService } from './init/init.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('UMS - User Management System API')
    .setDescription('REST API for user management with gRPC backend communication')
    .setVersion('1.0')
    .addTag('users', 'User operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 8091;
  await app.listen(port);

  console.log(`\n✅ Client HTTP API is running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api`);
  console.log(`Connected to gRPC server at ${process.env.GRPC_SERVER_URL || 'localhost:8081'}\n`);

  const initService = app.get(InitService);
  await initService.runInitSequence();
}

bootstrap();
