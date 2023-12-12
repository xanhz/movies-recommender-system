import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@src/auth/auth.service';
import { GoogleUser } from '@src/auth/strategies';
import { GoogleOAuth2Guard, JwtGuard, JwtRefreshGuard } from '@src/common/guards';
import { UserRequest } from '@src/common/interfaces';
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
    const { access_token, refresh_token } = await this.service.loginWithGoogle(req.user as GoogleUser);
    return res.redirect(`${redirectUrl}?access_token=${access_token}&refresh_token=${refresh_token}`);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  public refreshToken(@Req() req: Request) {
    const user = req.user as UserRequest;
    return this.service.generateTokens(user);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  public getProfile(@Req() req: Request) {
    const user = req.user as UserRequest;
    return this.service.getProfile(user.id);
  }
}
