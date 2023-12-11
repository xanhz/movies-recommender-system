import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly url: string;

  constructor(url: string, enableLog = false) {
    const options: Prisma.PrismaClientOptions = {
      datasourceUrl: url,
      log: enableLog ? [{ level: 'query', emit: 'event' }] : [],
    };
    super(options);

    this.url = url;
    this.logger = new Logger(PrismaService.name);

    if (enableLog) {
      this.$on('query' as never, (event: Prisma.QueryEvent) => {
        let { params, duration, query } = event;
        query = query.trim().replace(/[\n\s]+/g, ' ');
        query = query.replace(/"/g, '');
        if (query.toLowerCase() === 'select 1') {
          return;
        }
        this.logger.log('%o', { query, params, duration });
      });
    }
  }

  public async onModuleInit() {
    this.logger.log('Connecting to %s', this.url);
    await this.$connect();
    this.logger.log('Connected to %s', this.url);
  }

  public async onModuleDestroy() {
    this.logger.log('Disconnecting from %s', this.url);
    await this.$disconnect();
    this.logger.log('Disconnected from %s', this.url);
  }
}
