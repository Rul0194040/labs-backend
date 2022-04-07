import { UsersService } from '@sanfrancisco/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, LoginIdentityDTO } from './dto/loginIdentity.dto';
import { LoginResponseDTO } from './dto/loginresponse.dto';
import { compare } from 'bcryptjs';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { omit } from 'lodash';
import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
import { UserSucursalesEntity } from '@sanfrancisco/users/userSucursales.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Validamos al usuario, vamos por el con el service, y validamos su password.
   *
   * @param email Usuario que viene de post
   * @param pass Password en post
   * @returns null
   */
  async validateUser(
    email: string,
    pass: string,
    scope: ProfileTypes,
  ): Promise<any> {
    const user = await this.usersService.getByEmail(email, scope);

    if (!user) {
      return null;
    }

    //si el que intenta iniciar sesion es un empleado, debe traer escope empleado
    if (
      user.profile === ProfileTypes.EMPLEADO &&
      scope !== ProfileTypes.EMPLEADO
    ) {
      throw new HttpException(
        'Su cuenta solo es de empleado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.active) {
      throw new HttpException(
        'Su cuenta no está activa',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.accesoSistema) {
      throw new HttpException('Usted no tiene acceso', HttpStatus.UNAUTHORIZED);
    }

    if (await compare(pass, user.password)) {
      return omit(user, ['password']);
    }

    return null;
  }
  /**
   * Generación del JWT del usuario
   *
   * @param user Usuario que ha iniciado sesión.
   * @returns {LoginResponseDTO} response adecuada conteniendo el token y la identidad del usuario.
   */
  async login(
    user: UsersEntity, //viene de validate
    rememberme: boolean, //viene de controller
    device: any,
    sucursalId: number,
  ): Promise<LoginResponseDTO> {
    let sucursal: SucursalEntity | null = null;
    if (sucursalId) {
      const userSucursal = await getRepository(UserSucursalesEntity).findOne({
        where: { sucursal: sucursalId, user: user.id },
      });

      if (!userSucursal) {
        throw new HttpException(
          'Usuario y sucursal no corresponden.',
          HttpStatus.BAD_REQUEST,
        );
      }
      sucursal = await getRepository(SucursalEntity).findOne(sucursalId);
    }

    const identity: LoginIdentityDTO = {
      sub: user.id,
      uuid: user.uuid,
      id: user.id,
      profile: user.profile,
      email: user.email,
      firstName: user.firstName,
      grabandoRules: user.grabandoRules,
      rules: user.rules,
      lastName: user.lastName,
      picUrl: user.picUrl,
      createdAt: user.createdAt,
      validEmail: user.validEmail,
      sucursal: sucursal
        ? {
            id: sucursal.id,
            uuid: sucursal.uuid,
            nombre: sucursal.nombre,
          }
        : null,
    };
    const payload: JWTPayload = { sub: user.id, uuid: user.uuid, sucursalId };
    const response = {
      //se retorna al front
      access_token: this.jwtService.sign(payload, {
        expiresIn: rememberme
          ? this.configService.get<string>(ConfigKeys.JWT_REMEMBERME_EXPIRATION)
          : this.configService.get<string>(ConfigKeys.JWT_EXPIRATION),
      }),
      identity: identity,
    };

    //le guardamos su jwt en la bd
    const query = {
      jwt: response.access_token,
      device: {},
    };
    const queryUpdate = getRepository(UsersEntity)
      .createQueryBuilder()
      .where('id=:userId', { userId: user.id });

    //si viene device, actualizar
    if (device) {
      query.device = device;
    }

    await queryUpdate.update(query).execute();

    return response;
  }

  /**
   * Obtener una lista de cajas (si es cajero) y su nombre de usuario
   * @param email email de la cuenta
   * @returns
   */
  async cajasCajero(
    email: string,
  ): Promise<{ username: string; sucursales: Partial<SucursalEntity>[] }> {
    const user = await getRepository(UsersEntity).findOne({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException(
        'El email no está registrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //si no es cajero, retornamos solo username
    if (user.profile !== ProfileTypes.SUCURSAL) {
      return {
        username: `${user.firstName} ${user.lastName}`,
        sucursales: [],
      };
    }
    //obtener las sucursales del cajero
    const sucs = await getRepository(UserSucursalesEntity).find({
      where: { user: user.id },
      relations: ['sucursal'],
    });

    //si aun no tiene sucursales retornar un 400
    if (!sucs.length) {
      throw new HttpException(
        'Aún no cuenta con sucursales asignadas.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      username: `${user.firstName} ${user.lastName}`,
      sucursales: sucs.map((us) => {
        return {
          id: us.sucursal.id,
          nombre: us.sucursal.nombre,
        };
      }),
    };
  }
}
