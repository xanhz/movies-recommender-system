import { Module } from '@nestjs/common';
import { GenreController } from '@src/genre/genre.controller';
import { GenreService } from '@src/genre/genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
