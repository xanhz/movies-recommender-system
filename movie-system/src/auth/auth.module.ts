import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthController } from '@src/auth/auth.controller';
import { AuthModuleAsyncOptions, AuthModuleOptions } from '@src/auth/auth.interfaces';
import { AuthService } from '@src/auth/auth.service';
import { GoogleOAuth2Strategy } from '@src/auth/strategies';

@Module({})
export class AuthModule {
  public static forRoot(options: AuthModuleOptions): DynamicModule {
    const { googleStrategyOptions } = options;
    const StrategyProvider: Provider<GoogleOAuth2Strategy> = {
      provide: GoogleOAuth2Strategy,
      useValue: new GoogleOAuth2Strategy(googleStrategyOptions),
    };
    return {
      global: true,
      module: AuthModule,
      providers: [StrategyProvider, AuthService],
      controllers: [AuthController],
      exports: [],
    };
  }

  public static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    const { useFactory, imports = [], inject = [] } = options;
    const ModuleOptionsProvider: Provider<AuthModuleOptions> = {
      provide: 'AUTH_MODULE_OPTIONS',
      useFactory,
      inject,
    };
    const StrategyProvider: Provider<GoogleOAuth2Strategy> = {
      provide: GoogleOAuth2Strategy,
      useFactory: (options: AuthModuleOptions) => {
        const { googleStrategyOptions } = options;
        return new GoogleOAuth2Strategy(googleStrategyOptions);
      },
      inject: ['AUTH_MODULE_OPTIONS'],
    };
    return {
      global: true,
      module: AuthModule,
      imports,
      providers: [ModuleOptionsProvider, StrategyProvider, AuthService],
      controllers: [AuthController],
      exports: [],
    };
  }
}
