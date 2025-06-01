import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import { RegisterAuthDto } from './dto/register-auth.dto';

const scyrpt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(data: RegisterAuthDto) {
    const user = await this.userService.find(data.email);
    if (user.length) throw new BadRequestException('Email already exists');

    const salt = randomBytes(8).toString('hex');
    const hashedPassword = (await scyrpt(data.password, salt, 64)) as Buffer;

    data.password = `${salt}.${hashedPassword.toString('hex')}`;
    return this.userService.create(data);
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) throw new BadRequestException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hashPassword = (await scyrpt(password, salt, 64)) as Buffer;

    if (storedHash !== hashPassword.toString('hex'))
      throw new BadRequestException('Invalid password');

    return user;
  }
}
