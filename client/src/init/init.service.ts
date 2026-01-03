import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

interface UserService {
  createUser(data: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    password: string;
  }): Observable<any>;
  getUsersList(data: { offset: number; limit: number }): Observable<any>;
  loginUser(data: { email: string; password: string }): Observable<any>;
}

@Injectable()
export class InitService implements OnModuleInit {
  private userService: UserService;
  private createdUserIds: string[] = [];

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  private async waitForGrpcConnection(): Promise<void> {
    console.log('...Waiting for gRPC server connection...');

    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      if (this.userService) {
        console.log('✅ gRPC connection is ready!\n');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    throw new Error('Failed to connect to gRPC server');
  }

  async runInitSequence(): Promise<void> {
    console.log('\n===========================================');
    console.log('  STARTING INITIALIZATION SEQUENCE');
    console.log('===========================================\n');

    await this.waitForGrpcConnection();

    try {
      console.log('STEP 1: Loading users from users-init.json file');
      console.log('─────────────────────────────────────────────────────');
      await this.createUsersFromFile();

      console.log(`STEP 2: Loading 2nd page with 5 users`);
      console.log('─────────────────────────────────────────────────────');
      await this.getUsersListTest(5, 5);

      console.log(`STEP 3: Loading 2nd page with 10 users`);
      console.log('─────────────────────────────────────────────────────');
      await this.getUsersListTest(10, 10);

      console.log('STEP 4: Test duplicate email');
      console.log('─────────────────────────────────────────────────────');
      await this.testDuplicateEmail();

      console.log('STEP 5: Test user login');
      console.log('─────────────────────────────────────────────────────');
      await this.testLogin();

      console.log('\n===========================================');
      console.log('✅ INITIALIZATION SEQUENCE COMPLETED');
      console.log('===========================================\n');
    } catch (error) {
      console.error('\n❌ ERROR IN INITIALIZATION SEQUENCE:', error.message);
    }
  }

  private async createUsersFromFile(): Promise<void> {

    try {
      const filePath = path.join(process.cwd(), 'users-init.json');

      if (!fs.existsSync(filePath)) {
        console.error(`❌ File ${filePath} does not exist!`);
        return;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const users = JSON.parse(fileContent);

      console.log(`Loaded ${users.length} users from file\n`);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        try {
          const result = await firstValueFrom(
            this.userService.createUser(user),
          );

          if (result.error) {
            console.log(
              `   [${i + 1}/${users.length}] ⚠️  ${user.email}: ${result.error}`,
            );
          } else {
            this.createdUserIds.push(result.userId);
            console.log(
              `   [${i + 1}/${users.length}] ✅ ${user.email} -> ID: ${result.userId}`,
            );
          }
        } catch (error) {
          console.log(
            `   [${i + 1}/${users.length}] ❌ ${user.email}: ${error.message}`,
          );
        }
      }

      console.log(
        `\nCreated total of ${this.createdUserIds.length} users`,
      );
      console.log(`Created user IDs: ${this.createdUserIds.join(', ')}\n`);
    } catch (error) {
      console.error('❌ Error loading users-init.json:', error.message);
    }
  }

  private async getUsersListTest(
    offset: number,
    limit: number,
  ): Promise<void> {

    try {
      const result = await firstValueFrom(
        this.userService.getUsersList({ offset, limit }),
      );

      if (result.error) {
        console.log(`❌ Error: ${result.error}\n`);
      } else {
        const users = result.users || [];
        console.log(
          `✅ Loaded: offset=${result.offset}, limit=${result.limit}, total=${result.total}, returned=${users.length}`,
        );
        console.log(
          `Data: ${JSON.stringify({ users: users, total: result.total, offset: result.offset, limit: result.limit })}\n`,
        );
      }
    } catch (error) {
      console.error(`❌ Error loading list: ${error.message}\n`);
    }
  }

  private async testDuplicateEmail(): Promise<void> {

    if (this.createdUserIds.length === 0) {
      console.log('No users were created, test skipped\n');
      return;
    }

    try {
      const filePath = path.join(process.cwd(), 'users-init.json');
      const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const firstUserEmail = users[0].email;

      console.log(`   Attempting to create user with email: ${firstUserEmail}`);

      const result = await firstValueFrom(
        this.userService.createUser({
          firstName: 'Duplicate',
          lastName: 'Test',
          company: 'Test Company',
          email: firstUserEmail,
          password: 'password123',
        }),
      );

      if (result.error) {
        console.log(`✅ Expected error: ${result.error}`);
        console.log(`Data: ${JSON.stringify(result)}\n`);
      } else {
        console.log(
          `Unexpected result - user created: ${result.userId}\n`,
        );
      }
    } catch (error) {
      console.error(`❌ Error in duplicate test: ${error.message}\n`);
    }
  }

  private async testLogin(): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'users-init.json');
      const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const testUser = users[0];

      console.log(`   Logging user: ${testUser.email}`);

      const result = await firstValueFrom(
        this.userService.loginUser({
          email: testUser.email,
          password: testUser.password,
        }),
      );

      if (result.error) {
        console.log(`❌ Login error: ${result.error}\n`);
      } else {
        console.log(`✅ Login successful!`);
        console.log(`JWT Token: ${result.token.substring(0, 50)}...`);
        console.log(`Data: ${JSON.stringify(result)}\n`);
      }
    } catch (error) {
      console.error(`❌ Login error: ${error.message}\n`);
    }
  }
}
