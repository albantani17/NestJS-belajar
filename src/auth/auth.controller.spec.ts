import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  const fixedDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {};
    fakeAuthService = {
      login(email, password) {
        return Promise.resolve({
          id: '1313',
          username: 'test',
          name: 'test',
          email: email,
          password: password,
          createdAt: fixedDate,
          updatedAt: fixedDate,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user login', async () => {
    const session = {
      userId: null,
    };
    const user = await controller.login(
      { email: 'test@email.com', password: 'test' },
      session,
    );
    expect(user).toMatchObject({
      id: '1313',
      username: 'test',
      name: 'test',
      email: 'test@email.com',
      password: 'test',
      createdAt: fixedDate,
      updatedAt: fixedDate,
    });
    expect(session.userId).toEqual('1313');
  });
});
