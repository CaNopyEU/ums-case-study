import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    password: string;
  }) {
    return await this.userService.createUser(data);
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { userId: string }) {
    return await this.userService.getUser(data.userId);
  }

  @GrpcMethod('UserService', 'GetUsersList')
  async getUsersList(data: { offset: number; limit: number }) {
    return await this.userService.getUsersList(data.offset, data.limit);
  }

  @GrpcMethod('UserService', 'LoginUser')
  async loginUser(data: { email: string; password: string }) {
    return await this.userService.loginUser(data.email, data.password);
  }
}
