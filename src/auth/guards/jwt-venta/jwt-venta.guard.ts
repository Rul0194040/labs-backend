import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { MyLogger } from '@sanfrancisco/logger';

@Injectable()
export class JwtVentaGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  logger = new MyLogger(JwtVentaGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //obtener el request de quien lo invoca esta estrategia con el guard
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];

    if (!authorization) {
      return false;
    }

    //validamos el token
    const decoded: Partial<VentaEntity> = this.validateJWT(authorization);

    if (decoded && decoded.id) {
      request.venta = decoded; //inserción de identidad del paciente en req
      return true; //ok, pasele
    }

    //el guard no pasa
    return false;
  }

  validateJWT(jwt: string): any {
    try {
      const decoded = verify(
        jwt,
        this.configService.get<string>(ConfigKeys.JWT_SECRET),
      );
      return decoded;
    } catch (error) {
      return false;
    }
  }
}
