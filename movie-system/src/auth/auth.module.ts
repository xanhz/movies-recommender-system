import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from '@src/auth/auth.controller';
import { AuthModuleAsyncOptions, AuthModuleOptions } from '@src/auth/auth.interfaces';
import { AuthService } from '@src/auth/auth.service';
import { GoogleOAuth2Strategy, JwtRefreshStrategy, JwtStrategy } from '@src/auth/strategies';

@Module({})
export class AuthModule {
  public static forRoot(options: AuthModuleOptions): DynamicModule {
    const { googleStrategyOptions, jwtRefreshStrategyOptions, jwtStrategyOptions } = options;
    return {
      global: true,
      module: AuthModule,
      providers: [
        {
          provide: GoogleOAuth2Strategy,
          useValue: new GoogleOAuth2Strategy(googleStrategyOptions),
        },
        {
          provide: JwtStrategy,
          useValue: new JwtStrategy(jwtStrategyOptions),
        },
        {
          provide: JwtRefreshStrategy,
          useValue: new JwtRefreshStrategy(jwtRefreshStrategyOptions),
        },
        AuthService,
      ],
      controllers: [AuthController],
      exports: [],
    };
  }

  public static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    const { useFactory, imports = [], inject = [] } = options;
    return {
      global: true,
      module: AuthModule,
      imports,
      providers: [
        {
          provide: 'AUTH_MODULE_OPTIONS',
          useFactory,
          inject,
        },
        {
          provide: GoogleOAuth2Strategy,
          useFactory: (options: AuthModuleOptions) => {
            const { googleStrategyOptions } = options;
            return new GoogleOAuth2Strategy(googleStrategyOptions);
          },
          inject: ['AUTH_MODULE_OPTIONS'],
        },
        {
          provide: JwtStrategy,
          useFactory: (options: AuthModuleOptions) => {
            const { jwtStrategyOptions } = options;
            return new JwtStrategy(jwtStrategyOptions);
          },
          inject: ['AUTH_MODULE_OPTIONS'],
        },
        {
          provide: JwtRefreshStrategy,
          useFactory: (options: AuthModuleOptions) => {
            const { jwtRefreshStrategyOptions } = options;
            return new JwtRefreshStrategy(jwtRefreshStrategyOptions);
          },
          inject: ['AUTH_MODULE_OPTIONS'],
        },
        AuthService,
      ],
      controllers: [AuthController],
      exports: [],
    };
  }
}
