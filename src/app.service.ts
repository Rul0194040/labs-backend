import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from './common/enum/configkeys.enum';
import { MyLogger } from './logger';
import { createUserDTO } from './users/dto/createUser.dto';
import { ProfileTypes } from './users/profiles.enum';
import {
  AdminUsersToCreate,
  SuperUsersToCreate,
  AlmacenGeneralToCreate,
  SucursalToCreate,
  TesoreroSucCentralesToCreate,
  TesoreroSucForaneasToCreate,
  ComprasToCreate,
  DirectivosToCreate,
  GerenteSucursalesToCreate,
  VentaGeneralToCreate,
} from './users/users.collection';
import { UsersEntity } from './users/users.entity';
import { UsersService } from './users/users.service';

/**
 * Sevicio de app
 */
@Injectable()
export class AppService {
  /**
   * Constructor!
   *
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new MyLogger(AppService.name);

  /**
   * Intenta inicializar los registros necesarios en las tablas de
   * users
   */
  async initDatabase(): Promise<void> {
    if (this.configService.get<string>(ConfigKeys.CREATE_USERS)) {
      await this.createSuperUsers(SuperUsersToCreate);
      await this.createSysAdminUsers(AdminUsersToCreate);
      await this.createUserAlmacenGeneral(AlmacenGeneralToCreate);
      await this.createUserSucursal(SucursalToCreate);
      await this.createUserTesoreroSucursalesCentrales(
        TesoreroSucCentralesToCreate,
      );
      await this.createUserTesoreroSucursalesForaneas(
        TesoreroSucForaneasToCreate,
      );
      await this.createUserCompras(ComprasToCreate);
      await this.createUserDirectivos(DirectivosToCreate);
      await this.createUserGerenteSucursales(GerenteSucursalesToCreate);
      await this.createUserVentaGeneral(VentaGeneralToCreate);
    }
  }

  /**
   * Crea los usuarios que debe llevar el sistema
   * @param requiredUsers
   */

  private async createSuperUsers(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.SUPER;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }

  private async createSysAdminUsers(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.SYSADMIN;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios almacen general
   */
  private async createUserAlmacenGeneral(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.ALMACEN_GENERAL;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil sucursal
   */
  private async createUserSucursal(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.SUCURSAL;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil sucursales centrales
   */
  private async createUserTesoreroSucursalesCentrales(
    requiredUsers: createUserDTO[],
  ) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.TESORERO_SUCURSALES_CENTRALES;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil sucursales centrales
   */
  private async createUserTesoreroSucursalesForaneas(
    requiredUsers: createUserDTO[],
  ) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.TESORERO_SUCURSALES_FORANEAS;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil compras
   */
  private async createUserCompras(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.COMPRAS;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil directivos
   */
  private async createUserDirectivos(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.DIRECTIVOS;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil sucursales
   */
  private async createUserGerenteSucursales(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.GERENTE_SUCURSALES;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
  /**
   *
   * @param requiredUsers
   * usuarios perfil ventaGeneral
   */
  private async createUserVentaGeneral(requiredUsers: createUserDTO[]) {
    const users: UsersEntity[] = [];
    for (const user of requiredUsers) {
      const userFound: UsersEntity = await this.usersService.getByEmail(
        user.email,
      );
      //si no existe, lo creamos
      if (!userFound) {
        try {
          user.profile = ProfileTypes.VENTAS;
          const createdUser = await this.usersService.create(user);
          this.logger.log(
            `Created default user ${createdUser.email} (${createdUser.profile})`,
          );
          users.push(createdUser);
        } catch (error) {
          throw error;
        }
      } else {
        users.push(userFound);
      }
    }
    return users;
  }
}
