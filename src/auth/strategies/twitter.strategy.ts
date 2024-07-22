import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(private authService: AuthService) {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
      includeEmail: true,
    });
  }

  async validate(token: string, tokenSecret: string, profile: any, done: Function) {
    const { id, displayName, emails } = profile;
    const user = await this.authService.validateOAuthLogin(id, 'twitter');
    if (!user) {
      const newUser = await this.authService.registerOAuthUser(id, 'twitter', displayName, emails[0].value);
      return done(null, newUser);
    }
    return done(null, user);
  }
}
