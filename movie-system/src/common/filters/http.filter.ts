import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import _ from 'lodash';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;

    const httpException = this.toHttpException(exception);
    const statusCode = httpException.getStatus();
    const body = httpException.getResponse();

    if (_.isObject(body)) {
      delete body['statusCode'];
    }

    this.logger.error(`${statusCode} - ${method} ${url} | ${httpException.stack}`);

    return response.status(statusCode).json(body);
  }

  private toHttpException(exception: any) {
    if (exception instanceof HttpException) {
      return exception;
    }
    if (exception instanceof Error) {
      const { message, stack } = exception;
      const e = new InternalServerErrorException(message);
      e.stack = stack;
      return e;
    }
    return new InternalServerErrorException(exception);
  }
}
