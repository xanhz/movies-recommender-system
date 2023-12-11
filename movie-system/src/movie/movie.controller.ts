import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindMovieByIDDto, SearchMoviesDto } from '@src/movie/dto';
import { MovieService } from '@src/movie/movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly service: MovieService) {}

  @Get('')
  public search(@Query() query: SearchMoviesDto) {
    return this.service.search(query);
  }

  @Get(':id')
  public findByID(@Param() params: FindMovieByIDDto) {
    const { id } = params;
    return this.service.findByID(id);
  }

  @Get(':id/related')
  public findRelatedMovies(@Param() params: FindMovieByIDDto) {
    const { id } = params;
    return this.service.findRelatedMovies(id);
  }
}
