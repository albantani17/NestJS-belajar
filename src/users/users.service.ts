import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    if (attrs.email) attrs.email = attrs.email.toLowerCase();
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.remove(user);
  }
}
