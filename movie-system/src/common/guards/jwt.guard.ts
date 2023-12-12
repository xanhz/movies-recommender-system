import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
