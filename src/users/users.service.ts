import { MailService } from '../common/services/mailer/email.service';
import { updateUserDTO } from './dto/updateUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { createUserDTO } from './dto/createUser.dto';
import { compare } from 'bcryptjs';
import { UsersEntity } from './users.entity';
import { genSalt, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { ConfigKeys } from '@sanfrancisco/common/enum/configkeys.enum';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { forIn } from 'lodash';
import { statusUserDTO } from './dto/statusUser.dto';
import { SucursalEntity } from '../sucursales/sucursal.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { UserSucursalesEntity } from './userSucursales.entity';
import { ProfileTypes, PerfilTipoEmpleado } from './profiles.enum';

import * as readXlsxFile from 'read-excel-file/node';
import { LoginIdentityDTO } from '@sanfrancisco/auth/dto/loginIdentity.dto';
import { MyLogger } from '@sanfrancisco/logger';
@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailSenderService: MailService,
  ) {}
  private logger = new MyLogger(UsersService.name);
  async getMatrizAdmins(): Promise<UsersEntity[]> {
    return await getRepository(UsersEntity)
      .createQueryBuilder()
      .where('profile=:profile', { profile: ProfileTypes.ALMACEN_GENERAL })
      .getMany();
    //necesitamos los usuarios donde perfil='almacengeneral';
  }
  /**
   *
   * @returns
   */
  async getAdminsSuc(sucursalId: number): Promise<UsersEntity[]> {
    return await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .leftJoin('user.sucursal', 'sucursal')
      .where(
        'sucursal.id=:sucursalId AND user.profile=:profile AND user.active=:active',
        {
          profile: ProfileTypes.SUCURSAL,
          active: true,
          sucursalId,
        },
      )
      .getMany();
    //necesitamos los usuarios donde perfil='almacengeneral';
  }
  /**
   * Paginar usuarios
   * @param options para paginar los usuarios
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(UsersEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sucursal', 'sucursal')
      .select([
        'user',
        'sucursal.id',
        'sucursal.nombre',
        'sucursal.esMatriz',
        'sucursal.esLaboratorio',
        'sucursal.responsable',
      ]);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( user.firstName LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( user.lastName LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( user.email LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'user.createdAt';
    }

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort, 'DESC')
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }

  /**
   * Obtiene un usuario por id
   *
   * @param id del usuario a obtener
   */
  async getById(id: number): Promise<UsersEntity> {
    return getRepository(UsersEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sucursal', 'sucursal')
      .where('user.id = :theId', { theId: id })
      .getOne();
  }

  /**
   * Obtiene un usuario por su email
   *
   * @param email del usuario a obtener
   */
  async getByEmail(
    email: string,
    profile?: ProfileTypes,
  ): Promise<UsersEntity> {
    const q = getRepository(UsersEntity)
      .createQueryBuilder('user')
      .select(['user'])
      .where('user.email = :email', { email: email })
      .addSelect('user.password');
    if (profile) {
      q.andWhere('user.profile = :p', { p: profile });
    }
    return q.getOne();
  }

  /**
   * desactivar un usuario
   * @param id del usuario a desactivar
   */
  async statusById(id: number, status: statusUserDTO): Promise<UpdateResult> {
    return await getRepository(UsersEntity)
      .createQueryBuilder()
      .update()
      .set({
        active: status.active,
      })
      .where('id=:id', { id })
      .execute();
  }

  /**
   * Crea un usuario en la base de datos
   *
   * @param user objeto a crear
   */
  async create(
    userdto: createUserDTO,
    sendThisEmail = false,
  ): Promise<UsersEntity> {
    //si no trae password, ponerle el default
    if (!userdto.password) {
      userdto.password = this.configService.get<string>(
        ConfigKeys.FIRST_PASSWORD,
      );
    }
    //Encripta el password
    const newHash = await hash(userdto.password, await genSalt(10));
    const origPass = userdto.password;
    userdto.password = newHash;

    const userNip = await getRepository(UsersEntity).findOne({
      where: { nip: userdto.nip },
    });
    if (userNip) {
      throw new HttpException(
        'el nip que intenta guardar ya existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const usuario: Partial<UsersEntity> = {
      email: userdto.email,
      firstName: userdto.firstName,
      lastName: userdto.lastName,
      profile: userdto.profile,
      password: userdto.password,
      active: userdto.active,
      rules: userdto.rules,
      telefono: userdto.telefono,
      sucursal: null,
      nip: userdto.nip,
      maxDescuento: userdto.maxDescuento,
      tipoEmpleado: userdto.tipoEmpleado,
      comisionVendedor: userdto.comisionVendedor,
      accesoSistema: true,
    };
    // verificar si existe la sucursal que se le asigna
    if (userdto.sucursal) {
      const sucursal = await getRepository(SucursalEntity).findOne({
        id: userdto.sucursal,
      });
      if (!sucursal) {
        throw new HttpException('La sucursal no existe', HttpStatus.NOT_FOUND);
      }
      usuario.sucursal = sucursal;
    }

    if (!userdto.profile && userdto.sucursal) {
      usuario.profile = ProfileTypes.SUCURSAL;
    }

    //si su tipo no es general, no tiene acceso a sistema
    if (userdto.tipoEmpleado === PerfilTipoEmpleado.MAQUILADOR) {
      usuario.accesoSistema = false;
    }

    //Guardar el usuario
    const savedUser = await getRepository(UsersEntity).save(usuario);

    if (
      this.configService.get<string>(ConfigKeys.SEND_USER_EMAILS) &&
      sendThisEmail
    ) {
      this.mailSenderService.send(
        {
          to: userdto.email,
          subject: 'Tu nueva cuenta está lista ✔',
        },
        'welcome-user',
        {
          userName: `${userdto.firstName} ${userdto.lastName}`,
          password: origPass,
          siteName: this.configService.get<string>(ConfigKeys.SITE_NAME),
        },
      );
    }

    return savedUser;
  }

  /**
   *
   * Update del usuario
   *
   * @param id del usuario a actualizar
   * @param data que vamos a actualizar del usuario
   */
  async update(id: number, data: updateUserDTO): Promise<UpdateResult> {
    const user = await getRepository(UsersEntity).findOne(id);
    if (user && user.nip != data.nip) {
      const userNip = await getRepository(UsersEntity).findOne({
        where: { nip: data.nip },
      });
      if (userNip) {
        throw new HttpException(
          'imposible actualizar, el nip que intenta cambiar ya existe',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await getRepository(UsersEntity)
      .createQueryBuilder()
      .update()
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        telefono: data.telefono,
        email: data.email,
        nip: data.nip,
        maxDescuento: data.maxDescuento,
        comisionVendedor: data.comisionVendedor,
        grabandoRules: data.grabandoRules,
        accesoSistema: data.accesoSistema,
      })
      .where('id=:id', { id })
      .execute();
  }

  /**
   *
   * @param user usuario que cambia su contraseña
   * @param password contraseña anterior
   * @param newPassword contraseña nueva
   */
  async changePassword(
    user: LoginIdentityDTO,
    password: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    const theUser = await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: user.email })
      .addSelect('user.password')
      .getOne();

    if (!(await compare(password, theUser.password))) {
      throw new HttpException(
        'La contraseña anterior no es válida.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newHash = await hash(newPassword, await genSalt(10));
    const updateResult = await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .update()
      .set({ password: newHash, passwordToken: '', passwordTokenDate: '' })
      .where('id=:id', { id: user.id })
      .execute();
    if (updateResult.affected) {
      this.mailSenderService.send(
        {
          to: user.email,
          subject: 'Su contraseña ha sido cambiada ✔',
        },
        'changed-password',
        {
          siteName: this.configService.get<string>(ConfigKeys.SITE_NAME),
          user,
          newPassword,
        },
      );
    }
    return updateResult;
  }

  /**
   * Delete usuario
   * @param id del usuario a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(UsersEntity)
      .createQueryBuilder()
      .delete()
      .where('id=:id', { id })
      .execute();
  }

  /**
   * Cambia el password de un usuario segun el email y el token recibido,
   * la fecha del token aun debe ser valida.
   *
   * @param email Email del usuario
   * @param theToken el token a validar
   * @param newPassword el nuevo password del usuario
   *
   * @returns {UpdateResult} el update result con affected=1 cuando si se hizo el cambio,
   * si no se hizo, es por que o el email no coincide, o el token no coincide o el token ya
   * expiró o ya fué usado.
   *
   */
  async changePasswordByToken(
    email: string,
    theToken: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    const now = moment().format('YYYY-MM-DD H:m:s');
    console.log('now', now);
    const newHash = await hash(newPassword, await genSalt(10));
    const updateResult = await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .update()
      .set({ password: newHash, passwordToken: '', passwordTokenDate: '' })
      .where('email=:email', { email })
      .andWhere('passwordToken = :theToken', { theToken })
      .andWhere('passwordTokenDate >= :now', { now })
      .execute();
    if (updateResult.affected) {
      this.mailSenderService.send(
        {
          to: email,
          subject: 'Su contraseña ha sido cambiada ✔',
        },
        'changed-password',
        { siteName: this.configService.get<string>(ConfigKeys.SITE_NAME) },
      );
    }
    return updateResult;
  }

  /**
   * Inicia el proceso de cambio de password de un usuario.
   *
   * Esto genera un token, le pone fecha de expiracion al token de 10min
   * y envia un correo electronico al emal si es que existe.
   *
   * Siempre regresa un 200, sin importar si el usuario existe o no.
   *
   * @param email email del usuario a cambiar
   * @param profileType el tipo de perfil a filtrar
   */
  async startPasswordReset(email: string) {
    const user = await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .select(['user'])
      .where('email=:email', { email })
      .getOne();
    if (user) {
      //generar un token y fecha de token
      const token = uuidv4();
      const vencimiento = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 10); //valido por 10 min
      //almacenar
      const result = await getRepository(UsersEntity)
        .createQueryBuilder()
        .update()
        .set({ passwordToken: token, passwordTokenDate: vencimiento })
        .where('email=:theEmail', { theEmail: email })
        .execute();
      //enviar email
      const baseUrl = this.configService.get<string>(ConfigKeys.BASE_URL);
      if (result.affected) {
        const context = {
          userName: user.firstName + ' ' + user.lastName,
          token: token,
          passwordUrl: `${baseUrl}#/browse/user/change-password/${token}`,
          siteName: this.configService.get<string>(ConfigKeys.SITE_NAME),
        };
        this.mailSenderService.send(
          {
            to: user.email,
            subject: 'Solicitud de cambio de contraseña ✔',
          },
          'change-password',
          context,
        );
      }
    }
  }

  /**
   * Establecimiento del token email del usuairo
   *
   * @param id id del usuario
   * @param token token a establecer
   */
  async setEmailToken(id: number, token: string): Promise<boolean> {
    let response: boolean;
    const user: UsersEntity = await getRepository(UsersEntity).findOne(id);
    user.emailToken = token;
    getRepository(UsersEntity)
      .update(id, user)
      .then(() => {
        response = true;
      })
      .catch(() => {
        response = false;
      });
    return response;
  }

  /**
   * Establece el token de validacion de l usuario y le manda
   * un correo electronico con el token generado.
   *
   * @param id del usuario
   */
  async startEmailValidate(id: number): Promise<boolean> {
    //usuario
    const user: UsersEntity = await getRepository(UsersEntity).findOne(id);
    //generar token
    const token = (Math.random() * 1000000).toString();
    //actualizar usuario
    const result = await this.setEmailToken(id, token);

    if (!result) {
      return false;
    }

    //enviar email
    this.mailSenderService.send(
      {
        to: user.email,
        subject: 'Validación de correo electrónico ✔',
      },
      'validate-email',
      { user: user, token: token },
    );

    return true;
  }
  /**
   * Valida el token del usuario
   * @param id id del usuario
   * @param token token a verificar
   */
  async emailValidate(id: number, token: string): Promise<boolean> {
    //usuario
    const user: UsersEntity = await getRepository(UsersEntity).findOne(id);
    let result = false;

    //actualizar usuario
    if (user.emailToken === token) {
      result = await this.validEmail(id);
    }

    return result;
  }
  /**
   * Establece en true validEmail y emailToken en ''
   * para el usuario con el id que se pase de parametro
   * @param id
   */
  async validEmail(id: number): Promise<boolean> {
    let response: boolean;
    const user: UsersEntity = await getRepository(UsersEntity).findOne(id);
    user.validEmail = true;
    user.emailToken = '';
    getRepository(UsersEntity)
      .update(id, user)
      .then(() => {
        response = true;
      })
      .catch(() => {
        response = false;
      });
    return response;
  }

  async updateUserPicture(id: number, picUrl: string): Promise<UpdateResult> {
    return await getRepository(UsersEntity)
      .createQueryBuilder()
      .update()
      .set({ picUrl })
      .where('id=:id', { id: id })
      .execute();
  }

  async getProfiles() {
    const profiles = {
      ALMACEN_GENERAL: ProfileTypes.ALMACEN_GENERAL,
      TESORERO_SUCURSALES_CENTRALES: ProfileTypes.TESORERO_SUCURSALES_CENTRALES,
      TESORERO_SUCURSALES_FORANEAS: ProfileTypes.TESORERO_SUCURSALES_FORANEAS,
      COMPRAS: ProfileTypes.COMPRAS,
      DIRECTIVOS: ProfileTypes.DIRECTIVOS,
      GERENTE_SUCURSALES: ProfileTypes.GERENTE_SUCURSALES,
      SUCURSAL: ProfileTypes.SUCURSAL,
      EMPLEADO: ProfileTypes.EMPLEADO,
    };
    return profiles;
  }

  async getPerfilTipoEmpleados() {
    const tipoEmpleado = {
      GENERAL: PerfilTipoEmpleado.GENERAL,
      CAPTADOR: PerfilTipoEmpleado.CAPTADOR,
      MAQUILADOR: PerfilTipoEmpleado.MAQUILADOR,
      VENDEDOR: PerfilTipoEmpleado.VENDEDOR,
    };
    return tipoEmpleado;
  }

  async getSucursales(uId): Promise<Partial<SucursalEntity>[]> {
    const result = await getRepository(UserSucursalesEntity).find({
      where: {
        user: uId,
      },
      relations: ['sucursal'],
    });
    return result.map((us) => {
      return {
        id: us.sucursal.id,
        nombre: us.sucursal.nombre,
      };
    });
  }

  async asignarUsuarioSucursal(uId, sId): Promise<UserSucursalesEntity> {
    const existe = await getRepository(UserSucursalesEntity).findOne({
      user: uId,
      sucursal: sId,
    });

    if (!existe) {
      return await getRepository(UserSucursalesEntity).save({
        user: uId,
        sucursal: sId,
      });
    }

    return existe;
  }

  async desasignarUsuarioSucursal(uId, sId): Promise<DeleteResult> {
    const result = await getRepository(UserSucursalesEntity).delete({
      user: uId,
      sucursal: sId,
    });
    return result;
  }

  async grabarRule(rule: string, userId: number): Promise<'ok' | 'duplicated'> {
    const user = await getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.id = :uId', { uId: userId })
      .getOne();

    if (user.rules.indexOf(rule) > -1) {
      return 'duplicated';
    }

    user.rules.push(rule);

    await getRepository(UsersEntity).update(user.id, { rules: user.rules });

    return 'ok';
  }

  async finalizarGrabado(userId: number) {
    return await getRepository(UsersEntity).update(userId, {
      grabandoRules: false,
    });
  }
  async activarGrabado(userId: number, estatus = true) {
    return await getRepository(UsersEntity).update(userId, {
      grabandoRules: estatus,
    });
  }

  async importarEmpleados(xlsFile: string, sendEmails = false) {
    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' clientes');
    //por cada row de datos
    for (let r = 1; r <= rows.length - 1; r++) {
      const row = rows[r];
      const nombre = row[0]
        ? row[0].toString().trim().toUpperCase().split(' ')
        : null;
      const email = row[4] ? row[4].trim().toLowerCase() : null;
      if (email) {
        const firstName =
          nombre[2] + ' ' + nombre[3] + (nombre.lenght === 5 ? nombre[4] : '');
        const lastName = nombre[0] + ' ' + nombre[1];

        //si no existe... crearlo
        const existe = await getRepository(UsersEntity).findOne({
          where: { email: email },
        });

        if (!existe) {
          const creado = await this.create(
            {
              firstName,
              lastName,
              email,
              tipoEmpleado: PerfilTipoEmpleado.GENERAL,
              active: false,
              profile: ProfileTypes.EMPLEADO,
            },
            sendEmails,
          );
          this.logger.verbose('Creado empleado: ' + creado.email);
        } else {
          this.logger.verbose('Existente ' + existe.email);
          /*const actualizado = await this.usersService.update(existe.id, {
            firstName,
            lastName,
            email,
          });*/
        }
      }
    }
    return rows;
  }
}
