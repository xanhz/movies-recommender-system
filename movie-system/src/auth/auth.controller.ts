import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/auth/auth.service';
import { GoogleUser } from '@src/auth/strategies';
import { GoogleOAuth2Guard } from '@src/common/guards';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(GoogleOAuth2Guard)
  @Get('google')
  public redirectToGoogle() {
    return;
  }

  @UseGuards(GoogleOAuth2Guard)
  @Get('google/callback')
  public async callbackFromGoogle(@Req() req: Request, @Res() res: Response) {
    const redirectUrl = this.config.getOrThrow<string>('GOOGLE_REDIRECT_URL');
    await this.service.loginWithGoogle(req.user as GoogleUser);
    return res.redirect(redirectUrl);
  }
}
