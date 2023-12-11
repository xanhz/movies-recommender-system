import { Injectable, Logger } from '@nestjs/common';
import { GoogleUser } from '@src/auth/strategies';
import { PrismaService } from '@src/prisma';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.logger = new Logger(AuthService.name);
    this.prisma = prisma;
  }

  public async loginWithGoogle(user: GoogleUser) {
    const { email, fullname, avatar } = user;
    this.logger.log('Upsert User=%o', user);
    return this.prisma.user.upsert({
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
  }
}
