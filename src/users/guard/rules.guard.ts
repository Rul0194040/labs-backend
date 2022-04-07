import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { MyLogger } from '@sanfrancisco/logger';
import { ProfileTypes } from '../profiles.enum';
import { UsersService } from '../users.service';
/**
 * Guard que usa las rules insertadas por el decorador
 */
@Injectable()
export class RulesGuard implements CanActivate {
  /**
   * @ignore
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  private logger = new MyLogger(RulesGuard.name);
  /**
   * Guard para verificar tanto el perfil como las reglas
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //obtener las rules de metadata en contexto de quien lo llama (context.getHandler()=controller)
    const ruleRequiredInMethod = this.reflector.get<string>(
      'require-rule', //metadatos inyectados por el decorador @Rules a nivel metodo
      context.getHandler(), //metodo
    );

    //si la ruta no tiene metadata require-rule
    if (!ruleRequiredInMethod) {
      return true; //pasa
    }

    const request = context.switchToHttp().getRequest();
    const user: LoginIdentityDTO = request.user;

    //dejar pasar siempre a super
    if (user.profile === ProfileTypes.SUPER) {
      return true;
    }

    //si está grabando roles, dejar pasar!
    if (ruleRequiredInMethod && user.grabandoRules) {
      //pos grabarlo!
      const resultGrabar = await this.userService.grabarRule(
        ruleRequiredInMethod,
        user.id,
      );
      this.logger.log(
        `Grabar rule [${ruleRequiredInMethod}] para el usuario [${user.firstName} ${user.lastName}]: ${resultGrabar}`,
      );
      return true;
    }
    //si el usuario tiene la regla requerida en sus "rules"
    return user.rules.indexOf(ruleRequiredInMethod) > -1;
  }
}
