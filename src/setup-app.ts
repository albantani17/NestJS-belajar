import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');

export const setupApp = (app: INestApplication) => {
  const secret = process.env.SECRET;
  if (!secret) throw new Error('Secret is not defined');
  app.use(cookieSession({ keys: [secret], maxAge: 24 * 60 * 60 * 1000 }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
