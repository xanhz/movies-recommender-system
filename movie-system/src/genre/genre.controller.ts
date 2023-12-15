import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get } from '@nestjs/common';
import { TimeMS } from '@src/common/constants';
import { GenreService } from '@src/genre/genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly service: GenreService) {}

  @CacheTTL(TimeMS.ThirtyMinutes)
  @Get('')
  public findAll() {
    return this.service.findAll();
  }
}
