import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

export interface GoogleStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope?: string[];
}

export interface GoogleUser {
  email: string;
  fullname: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleOAuth2Strategy extends PassportStrategy(Strategy, 'google') {
  constructor(options: GoogleStrategyOptions) {
    super({
      scope: ['openid', 'email', 'profile'],
      ...options,
    });
  }

  public validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { name, email, picture } = profile._json;
    const user: GoogleUser = {
      email,
      accessToken,
      refreshToken,
      fullname: name,
      avatar: picture,
    };
    done(null, user);
  }
}
