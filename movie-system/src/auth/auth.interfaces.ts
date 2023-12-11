import { GoogleStrategyOptions } from '@src/auth/strategies';

export interface AuthModuleOptions {
  googleStrategyOptions: GoogleStrategyOptions;
}

export interface AuthModuleAsyncOptions {
  inject?: any[];
  imports?: any[];
  useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
}
