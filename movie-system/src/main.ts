import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@src/app.module';
import { HttpExceptionFilter } from '@src/common/filters';
import { ResponseInterceptor } from '@src/common/interceptors';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    cors: {
      origin: '*',
    },
  });

  /**
   * Global Filters
   */
  const exceptionsFilter = new HttpExceptionFilter();
  app.useGlobalFilters(exceptionsFilter);

  /**
   * Global Pipes
   */
  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    stopAtFirstError: true,
  });
  app.useGlobalPipes(validationPipe);

  /**
   * Global Interceptors
   */
  const responseInterceptor = new ResponseInterceptor();
  app.useGlobalInterceptors(responseInterceptor);

  app.disable('x-powered-by');

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  const port = +configService.get<number>('PORT', 5000);
  await app.listen(port, () => {
    logger.log(`App is listening on port ${port}`);
  });
}

bootstrap();
