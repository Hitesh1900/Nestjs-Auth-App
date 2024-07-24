import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;
    return this.userService.create(newUser);
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
    return this.userService.create(user as User);
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
}
