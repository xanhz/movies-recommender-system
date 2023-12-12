import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from '@src/auth/strategies';
import { UserRequest } from '@src/common/interfaces';
import { PrismaService } from '@src/prisma';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly prisma: PrismaService;
  private readonly config: ConfigService;

  constructor(prisma: PrismaService, config: ConfigService) {
    this.logger = new Logger(AuthService.name);
    this.prisma = prisma;
    this.config = config;
  }

  public async loginWithGoogle(user: GoogleUser) {
    const { email, fullname, avatar } = user;
    this.logger.log('Upsert User=%o', user);
    const $user = await this.prisma.user.upsert({
      create: {
        email,
        fullname,
        avatar,
      },
      update: {
        email,
        fullname,
        avatar,
      },
      where: {
        email,
      },
    });
    return this.generateTokens($user);
  }

  public generateTokens(user: UserRequest) {
    const { email, id, role } = user;
    const payload = { email, id, role };
    const jwtSecret = this.config.get<string>('JWT_SECRET');
    const accessExpiresIn = this.config.get<string>('JWT_ACCESS_EXPIRES_IN');
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN');

    return {
      access_token: jwt.sign(payload, jwtSecret, { expiresIn: accessExpiresIn }),
      refresh_token: jwt.sign(payload, jwtSecret, { expiresIn: refreshExpiresIn }),
    };
  }

  public async getProfile(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        avatar: true,
        fullname: true,
      },
    });
    if (_.isNil(user)) {
      throw new NotFoundException();
    }
    return user;
  }
}
