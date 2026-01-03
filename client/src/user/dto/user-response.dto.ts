import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user ID',
    example: 'usr_1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Company',
    example: 'ACME Inc.',
  })
  company: string;

  @ApiProperty({
    description: 'Email',
    example: 'john.doe@example.com',
  })
  email: string;
}

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'ID of created user',
    example: 'usr_1234567890',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Error message (if error occurred)',
    example: 'Email already exists',
    required: false,
  })
  error?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  token?: string;

  @ApiProperty({
    description: 'Error message (if error occurred)',
    example: 'Invalid credentials',
    required: false,
  })
  error?: string;
}

export class UsersListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
    required: false,
  })
  users?: UserResponseDto[];

  @ApiProperty({
    description: 'Total number of users',
    example: 15,
    required: false,
  })
  total?: number;

  @ApiProperty({
    description: 'Offset for pagination',
    example: 0,
    required: false,
  })
  offset?: number;

  @ApiProperty({
    description: 'Limit for pagination',
    example: 10,
    required: false,
  })
  limit?: number;

  @ApiProperty({
    description: 'Error message (if error occurred)',
    example: 'Limit must be 5, 10, or 25',
    required: false,
  })
  error?: string;
}
