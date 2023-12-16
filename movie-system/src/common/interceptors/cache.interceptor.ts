import { CACHE_TTL_METADATA, CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';

@Injectable()
export class CacheInterceptor extends NestCacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const ttl = this.reflector.get<number, string>(CACHE_TTL_METADATA, context.getHandler());
    return request.method === 'GET' && _.isNumber(ttl) && ttl > 0;
  }
}
