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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  CreateUserResponseDto,
  LoginResponseDto,
  UserResponseDto,
  UsersListResponseDto,
} from './dto/user-response.dto';

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

@ApiTags('users')
@Controller('api/users')
export class UserController implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or email already exists',
    type: CreateUserResponseDto,
  })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID',
    example: 'usr_1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({ userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get list of users with pagination' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit for pagination (allowed: 5, 10, 25)',
    example: 10,
    enum: [5, 10, 25],
  })
  @ApiResponse({
    status: 200,
    description: 'List of users sorted by email',
    type: UsersListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid limit value',
    type: UsersListResponseDto,
  })
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
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login, JWT token returned',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: LoginResponseDto,
  })
  loginUser(@Body() body: LoginUserDto) {
    return this.userService.loginUser(body);
  }
}
