import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@sanfrancisco/auth/auth.service';
/**
 * Aqí se valida el usuario por medio del service
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * @ignore
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }
  /**
   * Login del usuario
   * @param email
   * @param password
   */
  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<any> {
    const body: any = request.body;
    const user = await this.authService.validateUser(
      email,
      password,
      body.scope,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
