import { pbkdf2Sync } from 'crypto';

const hashPassword = (password: string) => {
  const secret = process.env.SECRET;
  if (!secret) throw new Error('Missing env variable: SECRET');
  const hashed = pbkdf2Sync(password, secret, 100_000, 64, 'sha512').toString(
    'hex',
  );
  return hashed;
};

export { hashPassword };
