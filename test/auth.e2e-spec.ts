import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  function generateRandomUser(): {
    username: string;
    name: string;
    email: string;
    password: string;
  } {
    const rand = Math.random().toString(36).substring(2, 10); // 8 karakter random
    return {
      username: `user_${rand}`,
      name: `Test User ${rand}`,
      email: `user_${rand}@example.com`,
      password: 'password123',
    };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
   //  setupApp(app);
    await app.init();
  });

  it('Handle register', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(generateRandomUser())
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
  });
});
