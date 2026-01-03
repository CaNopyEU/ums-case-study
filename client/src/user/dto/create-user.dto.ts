import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Company name',
    example: 'ACME Inc.',
  })
  company: string;

  @ApiProperty({
    description: 'User email (must be unique)',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
  })
  password: string;
}
