import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import _ from 'lodash';
import { UserRequest } from '../interfaces';

export const User = createParamDecorator((key: keyof UserRequest, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user as UserRequest;
  return !_.isEmpty(key) ? user?.[key] : user;
});
