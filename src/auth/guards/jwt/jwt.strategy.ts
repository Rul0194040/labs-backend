import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JWTPayload,
  LoginIdentityDTO,
} from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { UsersService } from '@sanfrancisco/users/users.service';
import { plainToClass } from 'class-transformer';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { getRepository } from 'typeorm';
/**
 * Estrategia para validacion del jwt
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @ignore
   */
  constructor(
    private readonly _configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get<string>(ConfigKeys.JWT_SECRET),
    });
  }
  /**
   * Validacion
   * @param payload payload data
   */
  async validate(payload: JWTPayload): Promise<LoginIdentityDTO> {
    //Retornamos lo que contiene el token como identidad.
    //ir a la bd de datos por el usuario!
    const user = await this.usersService.getById(payload.sub);
    if (!user.active) {
      throw new HttpException(
        'Su cuenta ha sido desactivada',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let sucursal: SucursalEntity;
    if (payload.sucursalId) {
      sucursal = await getRepository(SucursalEntity).findOne(
        payload.sucursalId,
      );
    }
    user.sucursal = sucursal;
    //aqui podriamos verificar el usuario contra la base de datos o algun otro
    //servicio, pero agrega demasiado tiempo a la solicitud cuando este viene de la BD
    //lo que retornemos aqui se adjuntara al request.
    const result = plainToClass(LoginIdentityDTO, user);
    return result;
  }
}
