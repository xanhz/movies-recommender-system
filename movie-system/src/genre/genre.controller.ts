import { Controller, Get } from '@nestjs/common';
import { GenreService } from '@src/genre/genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly service: GenreService) {}

  @Get('')
  public findAll() {
    return this.service.findAll();
  }
}
