import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieController } from '@src/movie/movie.controller';
import { MovieService } from '@src/movie/movie.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          baseURL: config.getOrThrow<string>('RECOMMENDER_SYSTEM_BASE_URL'),
        };
      },
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
