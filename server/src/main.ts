import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../src/proto/user.proto'),
        url: `0.0.0.0:${process.env.GRPC_PORT || 8081}`,
      },
    },
  );

  await app.listen();
  console.log(`gRPC Server is running on port ${process.env.GRPC_PORT || 8081}`);
}

bootstrap();
