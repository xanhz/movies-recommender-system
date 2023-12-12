import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchMoviesDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const ids: string[] = value?.trim().split(',') ?? [];
    return ids.map((id) => parseInt(id));
  })
  @IsArray()
  genre_ids?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    const fields = value?.trim().split(',') ?? [];
    const result = {};
    for (const field of fields) {
      result[field] = true;
    }
    return result;
  })
  fields?: Record<string, boolean>;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const sorts: string[] = value?.trim().split(',') ?? [];
    const result = {};
    for (const sort of sorts) {
      const [key, order] = sort.split(':');
      result[key] = order ?? 'asc';
    }
    return result;
  })
  order_by?: Record<string, 'asc' | 'desc'>;
}
