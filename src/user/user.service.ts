import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  findById(id: number) {
      throw new Error('Method not implemented.');
  }
  findOneByTwitterId(thirdPartyId: string): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  findOneByGoogleId(thirdPartyId: string): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
