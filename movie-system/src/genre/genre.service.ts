import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/prisma';

@Injectable()
export class GenreService {
  private readonly prisma: PrismaService;
  private readonly logger: Logger;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
    this.logger = new Logger(GenreService.name);
  }

  public findAll() {
    return this.prisma.genre.findMany();
  }
}
