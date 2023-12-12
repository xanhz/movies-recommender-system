import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

export interface JwtStrategyOptions {
  secretOrKey: string;
  ignoreExpiration?: boolean;
  jwtFromRequest?: JwtFromRequestFunction;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(options: JwtStrategyOptions) {
    const $options = _.defaults(options, {
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    super($options);
  }

  public validate(payload: any) {
    const { id, email } = payload;
    if (_.isNil(id) || _.isNil(email)) {
      throw new UnauthorizedException();
    }
    return { id, email };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(options: JwtStrategyOptions) {
    const $options = _.defaults(options, {
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('refresh_token'),
        ExtractJwt.fromHeader('x-refresh-token'),
      ]),
    });
    super($options);
  }

  public validate(payload: any) {
    const { id, email } = payload;
    if (_.isNil(id) || _.isNil(email)) {
      throw new UnauthorizedException();
    }
    return { id, email };
  }
}
