import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SearchMoviesDto } from '@src/movie/dto';
import { SearchMoviesQueryBuilder } from '@src/movie/query-builders';
import { PrismaService } from '@src/prisma';
import _ from 'lodash';

@Injectable()
export class MovieService {
  private readonly prisma: PrismaService;
  private readonly http: HttpService;
  private readonly logger: Logger;

  constructor(prisma: PrismaService, http: HttpService) {
    this.prisma = prisma;
    this.http = http;
    this.logger = new Logger(MovieService.name);
  }

  public async search(args: SearchMoviesDto) {
    const { fields, genre_ids, limit, order_by, page, title } = args;

    const builder = new SearchMoviesQueryBuilder();
    const query = builder
      .withTitle(title)
      .withGenres(genre_ids)
      .withPaginate(page, limit)
      .withOrderBy(order_by)
      .withSelect(fields)
      .build();

    const [total, movies] = await Promise.all([
      this.prisma.movie.count({ where: query.where }),
      this.prisma.movie.findMany(query),
    ]);

    return { total, limit, page, movies };
  }

  public async findByID(id: number) {
    const movie = await this.prisma.movie.findFirst({
      where: { id },
      include: {
        movie_genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
        movie_ratings: {
          select: {
            rating: true,
          },
        },
      },
    });
    if (_.isNil(movie)) {
      throw new NotFoundException('Movie not found');
    }
    const { movie_ratings, movie_genres, ...rest } = movie;
    return {
      ...rest,
      rating: {
        count: _.size(movie_ratings),
        avg: _.sumBy(movie_ratings, 'rating') / _.size(movie_ratings),
      },
      genres: _.map(movie_genres, (e) => e.genre.name),
    };
  }

  public async findRelatedMovies(id: number, limit = 10) {
    const genreIds = await this.findMovieGenres(id);
    if (_.isEmpty(genreIds)) {
      return [];
    }
    return this.prisma.movie.findMany({
      where: {
        movie_genres: {
          some: {
            genre_id: {
              in: genreIds,
            },
          },
        },
      },
      take: limit,
    });
  }

  private async findMovieGenres(id: number) {
    const movie = await this.prisma.movie.findFirst({
      where: { id },
      select: { movie_genres: { select: { genre_id: true } } },
    });
    return movie.movie_genres.map((e) => e.genre_id);
  }

  public async createMovieRating(data: Prisma.MovieRatingUncheckedCreateInput) {
    const response = await this.http.axiosRef({
      method: 'post',
      url: '/movie-ratings',
      data,
    });
    return response.data;
  }
}
