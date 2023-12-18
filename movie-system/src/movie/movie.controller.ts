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
  @Get('collection/hottest')
  public getHottestMovie() {
    return this.service.getHottestMovie();
  }

  @CacheTTL(TimeMS.ThirtyMinutes)
  @Get('collection/top')
  public getTopMovies(@Query('limit') limit: string = '10') {
    return this.service.getTopMovies(+limit);
  }

  @UseGuards(JwtGuard)
  @CacheTTL(TimeMS.OneMinute)
  @Get('collection/watched')
  public getWatchedMovies(@User('id') userID: number, @Query('limit') limit?: string) {
    limit ??= '10';
    return this.service.getWatchedMovies(userID, +limit);
  }

  @UseGuards(JwtGuard)
  @CacheTTL(TimeMS.ThirtyMinutes)
  @Get('collection/recommend')
  public getRecommendMovies(@User('id') userID: number, @Query('limit') limit: string = '10') {
    return this.service.getRecommendMovies(userID, +limit);
  }

  @UseGuards(JwtGuard)
  @Get('collection/next-watching')
  public getNextWatchingMovies(@User('id') userID: number, @Query('limit') limit: string = '10') {
    return this.service.getNextWatchingMovies(userID, +limit);
  }

  @CacheTTL(TimeMS.TenMinutes)
  @Get('')
  public search(@Query() query: SearchMoviesDto) {
    return this.service.search(query);
  }

  @CacheTTL(TimeMS.TenMinutes)
  @Get(':id')
  public findByID(@Param() params: FindMovieByIDDto) {
    const { id } = params;
    return this.service.findByID(id);
  }

  @CacheTTL(TimeMS.TenMinutes)
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
