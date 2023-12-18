import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@src/auth';
import { CacheInterceptor } from '@src/common/interceptors';
import { GenreModule } from '@src/genre';
import { MovieModule } from '@src/movie';
import { PrismaModule } from '@src/prisma';
import { LoggerModule } from 'nestjs-pino';
import prettyStream from 'pino-pretty';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: prettyStream({
          colorize: process.env.NODE_ENV !== 'production',
          levelFirst: true,
          translateTime: 'SYS:dd/mm/yyyy HH:MM:ss.l o',
          singleLine: true,
          ignore: 'pid,hostname',
          mkdir: true,
        }),
        autoLogging: false,
      },
      renameContext: 'ctx',
      forRoutes: [],
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: +config.get<number>('GLOBAL_CACHE_TTL', 0),
        };
      },
    }),
    PrismaModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          url: config.getOrThrow<string>('DATABASE_URL'),
        };
      },
    }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          googleStrategyOptions: {
            clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
          },
          jwtStrategyOptions: {
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
          },
          jwtRefreshStrategyOptions: {
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
          },
        };
      },
    }),
    MovieModule,
    GenreModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
