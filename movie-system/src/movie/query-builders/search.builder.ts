import { Prisma } from '@prisma/client';
import _ from 'lodash';

export class SearchMoviesQueryBuilder {
  private readonly query: Prisma.MovieFindManyArgs;

  constructor() {
    this.query = {
      where: {},
      take: 20,
      skip: 0,
    };
  }

  public withTitle(title?: string) {
    if (_.isEmpty(title)) {
      return this;
    }
    this.query.where['title'] = {
      search: title,
    };
    return this;
  }

  public withGenres(ids?: number[]) {
    if (_.isEmpty(ids)) {
      return this;
    }
    this.query.where['movie_genres'] = {
      some: {
        genre_id: {
          in: ids,
        },
      },
    };
    return this;
  }

  public withPaginate(page: number = 1, limit: number = 20) {
    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  public withOrderBy(orderBy?: Prisma.MovieOrderByWithRelationAndSearchRelevanceInput) {
    if (_.isEmpty(orderBy)) {
      return this;
    }
    this.query.orderBy = orderBy;
    return this;
  }

  public withSelect(select: Record<string, boolean>) {
    if (_.isEmpty(select)) {
      return this;
    }
    this.query.select = select;
    return this;
  }

  public build() {
    return this.query;
  }
}
