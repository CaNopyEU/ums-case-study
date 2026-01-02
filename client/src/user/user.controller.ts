import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserService {
  createUser(data: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    password: string;
  }): Observable<any>;
  getUser(data: { userId: string }): Observable<any>;
  getUsersList(data: { offset: number; limit: number }): Observable<any>;
  loginUser(data: { email: string; password: string }): Observable<any>;
}

@Controller('api/users')
export class UserController implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Post()
  createUser(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      company: string;
      email: string;
      password: string;
    },
  ) {
    return this.userService.createUser(body);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({ userId });
  }

  @Get()
  getUsersList(
    @Query('offset') offset: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    return this.userService.getUsersList({
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Post('login')
  loginUser(@Body() body: { email: string; password: string }) {
    return this.userService.loginUser(body);
  }
}
