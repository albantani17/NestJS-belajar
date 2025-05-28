import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    username: string,
    name: string,
    email: string,
    password: string,
  ) {
    const user = this.userRepository.create({
      username,
      name,
      email,
      password,
    });
    return this.userRepository.save(user);
  }
}
