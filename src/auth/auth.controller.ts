import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Param,
  Options,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/loginresponse.dto';
import { LocalAuthGuard } from './guards/local/local-auth.guard';
import { RateLimit } from 'nestjs-rate-limiter';
import { UsersService } from '@sanfrancisco/users/users.service';
import { LoginEmailDataDTO } from './dto/loginEmailData.dto';
import { UpdateResult } from 'typeorm';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   *
   * @tests ['Super Login', 'Admin Login']
   * @param body
   * @param req
   * @returns
   */
  @ApiOperation({
    summary: 'Inicio de sesión, no debe permitir inicio de usuarios inactivos.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @RateLimit({
    keyPrefix: 'login',
    points: 5,
    duration: 60,
    errorMessage: 'Solo puede intentar 5 veces en 5 minutos máximo.',
  })
  async login(
    @Body() body: LoginDTO,
    @Request() req,
  ): Promise<LoginResponseDTO> {
    return this.authService.login(
      req.user,
      body.rememberme,
      body.device,
      body.sucursalId,
    );
  }

  @Options('login')
  optionsLogin() {
    return '';
  }

  /**
   * Obtener informacion previa del login de un usuario:
   *
   * @param {email: string} data email del usuario
   * @returns {
   *  sucursales:SucursalEntity[], // donde puede inciar sesion
   *  username: string, // nombre del cajero
   * }
   */
  @Post('login/email')
  async getLoginData(@Body() data: LoginEmailDataDTO) {
    //si es cajero, regresar array de sucursal
    return this.authService.cajasCajero(data.email.toLowerCase());
  }

  @Options('login/email')
  getLoginDataOptions() {
    return '';
  }
  /**
   * Inicia la solicitud de cambio del password de un usuario
   *
   * @param email email del usuario que solicita el cambio
   *
   * @returns siempre regresa un 200
   */
  @Put('password-reset')
  passwordReset(@Body('email') email: string) {
    //desde este controller solo cambiar los de public
    return this.usersService.startPasswordReset(email);
  }

  /**
   * Cambia el password de un usuario segun el email y el token recibido,
   * la fecha del token aun debe ser valida.
   *
   * @param token el token a validar
   * @param newPassword el nuevo password del usuario
   * @param email Email del usuario
   *
   * @returns {UpdateResult} el update result con affected=1 cuando si se hizo el cambio,
   * si no se hizo, es por que o el email no coincide, o el token no coincide o el token ya
   * expiró o ya fué usado.
   *
   */

  @Put('password-reset/:token')
  async getPasswordToken(
    @Param('token') token: string,
    @Body('password') newPassword: string,
    @Body('email') email: string,
  ): Promise<UpdateResult> {
    return this.usersService.changePasswordByToken(email, token, newPassword);
  }
}
