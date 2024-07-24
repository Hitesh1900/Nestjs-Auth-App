import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const newUser = new User();
    newUser.username = body.username;
    newUser.password = body.password;
    return this.userService.create(newUser);
  }
}
