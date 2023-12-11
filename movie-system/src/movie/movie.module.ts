import { Module } from '@nestjs/common';
import { MovieController } from '@src/movie/movie.controller';
import { MovieService } from '@src/movie/movie.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
