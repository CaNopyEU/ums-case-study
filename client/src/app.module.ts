import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserController } from './user/user.controller';
import { InitService } from './init/init.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../src/proto/user.proto'),
          url: process.env.GRPC_SERVER_URL || 'localhost:8081',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [InitService],
})
export class AppModule {}
