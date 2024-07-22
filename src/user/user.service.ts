import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({where:{id}});
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findOneByTwitterId(twitterId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { twitterId } });
  }

  async linkGoogleAccount(userId: number, googleId: string): Promise<User> {
    const user = await this.findById(userId);
    if (user) {
      user.googleId = googleId;
      return this.usersRepository.save(user);
    }
    return null;
  }

  async linkTwitterAccount(userId: number, twitterId: string): Promise<User> {
    const user = await this.findById(userId);
    if (user) {
      user.twitterId = twitterId;
      return this.usersRepository.save(user);
    }
    return null;
  }
}
