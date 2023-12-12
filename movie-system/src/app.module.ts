import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@src/auth';
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
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env',
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
})
export class AppModule {}
