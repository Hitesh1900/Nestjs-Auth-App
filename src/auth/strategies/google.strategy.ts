import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, displayName, emails } = profile;
    const user = await this.authService.validateOAuthLogin(id, 'google');
    if (!user) {
      const newUser = await this.authService.registerOAuthUser(id, 'google', displayName, emails[0].value);
      return done(null, newUser);
    }
    return done(null, user);
  }
}
