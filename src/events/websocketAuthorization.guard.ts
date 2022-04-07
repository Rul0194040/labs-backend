import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WSMessageBodyDTO } from './messagebody.dto';
import { verify } from 'jsonwebtoken';
import { LoginIdentityDTO } from '../auth/dto/loginIdentity.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '../common/enum/configkeys.enum';
import { getRepository } from 'typeorm';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { MyLogger } from '@sanfrancisco/logger';
/**
 * Guard para socket, utilizamos la misma metodología...
 */
@Injectable()
export class WebsocketGuardAuthorization implements CanActivate {
  private readonly logger = new MyLogger(WebsocketGuardAuthorization.name);
  /**
   * Servicios requeridos
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {}
  /**
   * Puede o no puede?
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //obtenemos el cliente del contexto para insertarle su identidad
    const wsClient = context.switchToWs().getClient();

    // data del contexto, será modificada
    const data: WSMessageBodyDTO = context.switchToWs().getData();

    //validamos el token
    const decoded: LoginIdentityDTO | boolean = await this.validateJWT(
      data.Authorization,
    );

    if (decoded && decoded['uuid']) {
      wsClient.user = decoded; //inserción de identidad en el cliente
      return true; //ok, pasele
    }

    //el guard no pasa
    return false;
  }
  /**
   * Validación del token con la libreria
   * @param jwt
   */
  async validateJWT(jwt: string): Promise<LoginIdentityDTO | boolean> {
    try {
      const decoded = verify(
        jwt,
        this.configService.get<string>(ConfigKeys.JWT_SECRET),
      );
      const user = await getRepository(UsersEntity).findOne({
        where: { uuid: decoded['uuid'] },
        relations: ['sucursal'],
      });
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
        sucursal: user.sucursal
          ? {
              id: user.sucursal.id,
              uuid: user.sucursal.uuid,
              nombre: user.sucursal.nombre,
            }
          : null,
      };

      return identity;
    } catch (error) {
      return false;
    }
  }
}
