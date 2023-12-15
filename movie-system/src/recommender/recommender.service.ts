import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { UserRequest } from '@src/common/interfaces';
import { PrismaService } from '@src/prisma';

@Injectable()
export class RecommenderService {
  private readonly http: HttpService;
  private readonly prisma: PrismaService;
  private readonly logger: Logger;

  constructor(http: HttpService, prisma: PrismaService) {
    this.http = http;
    this.prisma = prisma;
    this.logger = new Logger(RecommenderService.name);
  }

  public async recommendToday(user: UserRequest, nItems = 10) {
    const response = await this.http.axiosRef<number[][]>({
      method: 'get',
      url: `/recommend/${user.id}/movies/today`,
      params: {
        k: nItems,
      },
    });
    const movieIds = response.data.map((e) => e[0]);

    return this.prisma.movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });
  }

  public async recommendNextWatching(user: UserRequest, nItems = 10) {
    const response = await this.http.axiosRef<number[][]>({
      method: 'get',
      url: `/recommend/${user.id}/movies/next-watching`,
      params: {
        k: nItems,
      },
    });
    const movieIds = response.data.map((e) => e[0]);

    return this.prisma.movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
    });
  }
}
