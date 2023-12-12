import { PrismaClient } from '@prisma/client';

export const client = new PrismaClient({
  datasourceUrl: 'mysql://root:123456@localhost:3306/movie-system',
});
