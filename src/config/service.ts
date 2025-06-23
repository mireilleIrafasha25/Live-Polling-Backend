// user.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/userEntity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (dto.role === 'admin') {
      const existingAdmin = await this.userRepository.findOne({ where: { role: 'admin' } });
      if (existingAdmin) {
        throw new BadRequestException('Admin umwe gusa yemerewe.');
      }
    }

    const newUser = this.userRepository.create(dto);
    return await this.userRepository.save(newUser);
  }
}
