import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  register(username: string, password: string) {
      throw new Error('Method not implemented.');
  }
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthLogin(thirdPartyId: string, provider: string): Promise<User> {
    let user: User;
    switch (provider) {
      case 'google':
        user = await this.userService.findOneByGoogleId(thirdPartyId);
        break;
      case 'twitter':
        user = await this.userService.findOneByTwitterId(thirdPartyId);
        break;
    }
    return user;
  }

  async registerOAuthUser(
    thirdPartyId: string,
    provider: string,
    displayName: string,
    email: string,
  ): Promise<User> {
    let user: Partial<User> = { username: displayName, password: '' };
    switch (provider) {
      case 'google':
        user.googleId = thirdPartyId;
        break;
      case 'twitter':
        user.twitterId = thirdPartyId;
        break;
    }
    return this.userService.create(user);
  }
}
