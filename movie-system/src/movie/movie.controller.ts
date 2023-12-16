import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TimeMS } from '@src/common/constants';
import { User } from '@src/common/decorators';
import { JwtGuard } from '@src/common/guards';
import { UserRequest } from '@src/common/interfaces';
import { CreateRatingDto, FindMovieByIDDto, SearchMoviesDto } from '@src/movie/dto';
import { MovieService } from '@src/movie/movie.service';
import _ from 'lodash';

@Controller('movies')
export class MovieController {
  constructor(private readonly service: MovieService) {}

  @CacheTTL(TimeMS.ThirtyMinutes)
  @Get('collection/hot')
  public findHotMovies(@Query('limit') limit?: string) {
    limit ??= '10';
    return this.service.findHotMovies(+limit);
  }

  @UseGuards(JwtGuard)
  @CacheTTL(TimeMS.OneMinute)
  @Get('collection/watched')
  public findWatchedMovies(@User('id') userID: number, @Query('limit') limit?: string) {
    limit ??= '10';
    return this.service.findWatchedMovies(userID, +limit);
  }

  @CacheTTL(TimeMS.FiveSecond)
  @Get('')
  public search(@Query() query: SearchMoviesDto) {
    return this.service.search(query);
  }

  @CacheTTL(TimeMS.FiveMinutes)
  @Get(':id')
  public findByID(@Param() params: FindMovieByIDDto) {
    const { id } = params;
    return this.service.findByID(id);
  }

  @CacheTTL(TimeMS.FiveMinutes)
  @Get(':id/related')
  public findRelatedMovies(@Param() params: FindMovieByIDDto) {
    const { id } = params;
    return this.service.findRelatedMovies(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/ratings')
  public create(@Param() params: FindMovieByIDDto, @Body() body: CreateRatingDto, @User() user: UserRequest) {
    return this.service.createMovieRating({
      movie_id: _.get(params, 'id'),
      rating: _.get(body, 'rating'),
      user_id: _.get(user, 'id'),
      time: new Date(),
    });
  }
}
