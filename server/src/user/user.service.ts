import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly dbUrl = process.env.DB_URL || 'http://localhost:3000';
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '24h';
  private readonly bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

  async createUser(data: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    password: string;
  }): Promise<{ userId?: string; error?: string }> {
    try {
      const existingUsers = await axios.get(`${this.dbUrl}/users`, {
        params: { email: data.email },
      });

      if (existingUsers.data.length > 0) {
        return { error: 'User with this email already exists' };
      }

      const hashedPassword = await bcrypt.hash(data.password, this.bcryptSaltRounds);

      const userId = uuidv4();
      const user: User = {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        password: hashedPassword,
      };

      await axios.post(`${this.dbUrl}/users`, user);

      return { userId };
    } catch (error) {
      return { error: `Failed to create user: ${error.message}` };
    }
  }

  async getUser(userId: string): Promise<{
    userId?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    error?: string;
  }> {
    try {
      const response = await axios.get(`${this.dbUrl}/users`, {
        params: { userId },
      });

      if (response.data.length === 0) {
        return { error: 'User not found' };
      }

      const user = response.data[0];

      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        email: user.email,
      };
    } catch (error) {
      return { error: `User not found: ${error.message}` };
    }
  }

  async getUsersList(offset: number, limit: number): Promise<{
    users: Array<{ userId: string; email: string }>;
    total: number;
    offset: number;
    limit: number;
    error?: string;
  }> {
    try {
      if (![5, 10, 25].includes(limit)) {
        return {
          users: [],
          total: 0,
          offset,
          limit,
          error: 'Limit must be 5, 10, or 25',
        };
      }

      const response = await axios.get(`${this.dbUrl}/users`);
      const allUsers: User[] = response.data;

      const sortedUsers = allUsers.sort((a, b) =>
        a.email.localeCompare(b.email)
      );

      const paginatedUsers = sortedUsers.slice(offset, offset + Math.min(limit, 25));

      return {
        users: paginatedUsers.map((u) => ({
          userId: u.userId,
          email: u.email,
        })),
        total: sortedUsers.length,
        offset,
        limit,
      };
    } catch (error) {
      return {
        users: [],
        total: 0,
        offset,
        limit,
        error: `Failed to get users: ${error.message}`,
      };
    }
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ token?: string; error?: string }> {
    try {
      const response = await axios.get(`${this.dbUrl}/users`, {
        params: { email },
      });

      if (response.data.length === 0) {
        return { error: 'Invalid credentials' };
      }

      const user: User = response.data[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { error: 'Invalid credentials' };
      }

      const token = jwt.sign(
        {
          userId: user.userId,
          email: user.email,
        },
        this.jwtSecret,
        { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
      );

      return { token };
    } catch (error) {
      return { error: `Login failed: ${error.message}` };
    }
  }
}
