import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from '@src/common/decorators';
import { JwtGuard } from '@src/common/guards';
import { UserRequest } from '@src/common/interfaces';
import { RecommenderService } from '@src/recommender/recommender.service';

@UseGuards(JwtGuard)
@Controller('recommender')
export class RecommenderController {
  constructor(private readonly service: RecommenderService) {}

  private toInteger(str: string, defaultValue = 10) {
    const re = /^\d*(\.\d+)?$/;
    return re.test(str) ? parseInt(str) : defaultValue;
  }

  @Get('movies/today')
  public recommendToday(@User() user: UserRequest, @Query('k') k: string) {
    const nItems = this.toInteger(k);
    return this.service.recommendToday(user, nItems);
  }

  @Get('movies/next-watching')
  public recommendNextWatching(@User() user: UserRequest, @Query('k') k: string) {
    const nItems = this.toInteger(k);
    return this.service.recommendNextWatching(user, nItems);
  }
}
