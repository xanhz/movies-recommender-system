import { GoogleStrategyOptions, JwtStrategyOptions } from '@src/auth/strategies';

export interface AuthModuleOptions {
  googleStrategyOptions: GoogleStrategyOptions;
  jwtStrategyOptions: JwtStrategyOptions;
  jwtRefreshStrategyOptions: JwtStrategyOptions;
}

export interface AuthModuleAsyncOptions {
  inject?: any[];
  imports?: any[];
  useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
}
