import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { User } from '@/users/user.entity';

describe('AuthService', () => {
  let fakeUsersService: Partial<UsersService>;
  let service: AuthService;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email?: string) => {
        const user = email
          ? users.filter((user) => user.email === email)
          : users;
        return Promise.resolve(user);
      },
      create: async (data: CreateUserDto) => {
        const user = await Promise.resolve({
          ...data,
          id: '1313',
          createdAt: new Date(),
          updatedAt: new Date(),
          lowercaseEmail() {
            return this.email.toLowerCase();
          },
        } as User);
        users.push(user);
        return user;
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const mockData = {
    name: 'test',
    username: 'test',
    email: 'test@test.com',
    password: 'test',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a new user', async () => {
    const user = await service.register(mockData);
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to create user with an existing email', async () => {
    await service.register(mockData);
    expect(service.register(mockData)).rejects.toThrow('Email already exists');
  });

  it('should fail to login with wrong email', async () => {
    await service.register(mockData);
    await expect(service.login('coba', 'test')).rejects.toThrow(
      'User not found',
    );
  });

  it('should fail to login with wrong password', async () => {
    await service.register(mockData);
    const user = service.login('test@test.com', 'testSalah');
    await expect(user).rejects.toThrow('Invalid password');
  });

  it('should be login existing user', async () => {
    await service.register(mockData);
    const user = await service.login('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});
