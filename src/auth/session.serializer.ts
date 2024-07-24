import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: any, id?: any) => void) {
    done(null, user.id); 
  }

  async deserializeUser(id: number, done: (err: any, user?: any) => void) {
    const user = await this.userService.findById(id); 
    done(null, user);
  }
}
