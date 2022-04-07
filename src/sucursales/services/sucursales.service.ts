import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { PagoEntity } from '@sanfrancisco/pagos/pagos.entity';
import { PaginationPrimeNgResult } from '../../common/DTO/pagination-prime-Ng-result.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSucursalDTO } from '../dto/createSucursal.dto';
import { SucursalEntity } from '../sucursal.entity';
import { getRepository, DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSucursalDTO } from '../dto/updateSucursal.dto';
import { plainToClass } from 'class-transformer';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';
import { ApiKeyEntity } from '../api-keys.entity';
import { UserSucursalesEntity } from '@sanfrancisco/users/userSucursales.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import * as moment from 'moment';

@Injectable()
export class SucursalesService {
  private readonly notFoundMessage = 'Sucursal no encontrada';

  /**
   * Crea una nueva sucursal en la base de datos
   *
   * @param sucursal Sucursal a crear
   * @returns {SucursalEntity}
   */
  async create(sucursal: CreateSucursalDTO): Promise<SucursalEntity> {
    //solo debe habier una matriz
    if (sucursal.esMatriz) {
      const hayMatriz = await getRepository(SucursalEntity).findOne({
        esMatriz: true,
      });
      if (hayMatriz) {
        throw new HttpException('Ya existe una matriz', HttpStatus.BAD_REQUEST);
      }
    }

    if (sucursal.responsableId) {
      const responsable = await getRepository(UsersEntity).findOne(
        sucursal.responsableId,
      );
      sucursal.userResponsable = responsable;
    }
    const sucursalToCreate = plainToClass(SucursalEntity, sucursal);
    const sucursalCreada = await getRepository(SucursalEntity).save(
      sucursalToCreate,
    );

    //crear su primer apikey
    await getRepository(ApiKeyEntity).save({
      sucursal: sucursalCreada,
      nombre: sucursal.apiKey,
    });
    return sucursalCreada;
  }
  /**
   * Buscar sucursal por id
   * @param id para buscar el objeto sucursal
   */
  async getById(id: number): Promise<SucursalEntity> {
    const sucursal = await getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .leftJoin('sucursal.apikeys', 'apikeys')
      .leftJoin('sucursal.userResponsable', 'userResponsable')
      .select([
        'sucursal',
        'apikeys',
        'userResponsable.id',
        'userResponsable.firstName',
        'userResponsable.lastName',
        'userResponsable.email',
      ])
      .where('sucursal.id = :id', { id: id })
      .getOne();

    if (!sucursal) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return sucursal;
  }
  /**
   * Actualizar un objeto sucursal
   * @param id del objeto a actualizar
   * @param sucursal data para actualizar el objeto
   */
  async update(id: number, sucursal: UpdateSucursalDTO): Promise<UpdateResult> {
    const theSucursal = await this.getById(id);

    if (!theSucursal) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    if (sucursal.responsableId) {
      const responsable = await getRepository(UsersEntity).findOne(
        sucursal.responsableId,
      );
      sucursal.userResponsable = responsable;
      delete sucursal.responsableId;
    }

    return await getRepository(SucursalEntity).update({ id }, sucursal);
  }
  /**
   * Actualizar el status del objeto surcursales
   * @param id del objeto a actualiazar su status
   * @param active referencia del campo active del objeto sucursales
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const theSucursal = await this.getById(id);

    if (!theSucursal) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .update()
      .set({ active })
      .where({ id: theSucursal.id })
      .execute();
  }
  /**
   * Borrar un objeto sucursal
   * @param id del objeto sucursal a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(SucursalEntity).delete({ id });
  }
  /**
   * Paginar registros sucursales
   * @param options para paginar los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .leftJoin('sucursal.userResponsable', 'userResponsable')
      .select([
        'sucursal',
        'userResponsable.id',
        'userResponsable.firstName',
        'userResponsable.lastName',
        'userResponsable.email',
      ]);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( sucursal.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'id';
    }

    let direction: 'ASC' | 'DESC' = 'ASC';

    if (options.direction) {
      direction = options.direction;
    }

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort, direction)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }

  /**
   * Obtiene la informacion de la sucursal matriz
   *
   * @returns {SucursalEntity} sucursal matriz
   */
  async getSucursalMatriz(): Promise<SucursalEntity> {
    return await getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .where('sucursal.esMatriz = :esMatriz', { esMatriz: true })
      .getOne();
  }

  /**
   * obtienes los usuarios por sucursal
   *
   * @param idSucursal id de la sucursal
   * @returns {SucursalEntity} lista de usuarios por sucursal
   */
  async getUsersBySucursal(
    idSucursal: number,
  ): Promise<Partial<UsersEntity>[]> {
    const uss = await getRepository(UserSucursalesEntity).find({
      where: { sucursal: idSucursal },
      relations: ['user'],
    });
    const usuarios = uss.map((us) => {
      return {
        email: us.user.email,
        firstName: us.user.firstName,
        lastName: us.user.lastName,
        profile: us.user.profile,
        active: us.user.active,
        id: us.user.id,
        rules: us.user.rules,
        uuid: us.user.uuid,
        picUrl: us.user.picUrl,
        telefono: us.user.telefono,
      };
    });
    return usuarios;
  }

  async getByApiKey(apikey: string): Promise<SucursalEntity> {
    return getRepository(SucursalEntity)
      .createQueryBuilder('sucursal')
      .leftJoinAndSelect('sucursal.apikeys', 'apikeys')
      .where('apikeys.active = :activos AND apikeys.key = :theKey', {
        activos: true,
        theKey: apikey,
      })
      .getOne();
  }

  async crearApiKey(sucursalId: number, nombre: string): Promise<ApiKeyEntity> {
    const sucursal = await this.getById(sucursalId);
    if (!sucursal) {
      throw new HttpException('No existe la sucursal', HttpStatus.NOT_FOUND);
    }
    return getRepository(ApiKeyEntity).save({
      sucursal,
      nombre,
    });
  }

  async estatusApiKey(key: string, active: boolean): Promise<UpdateResult> {
    const apiKey = await getRepository(ApiKeyEntity).findOne({
      where: { key: key },
    });
    if (!apiKey) {
      throw new HttpException('No existe el api key', HttpStatus.NOT_FOUND);
    }
    return getRepository(ApiKeyEntity).update(
      { id: apiKey.id },
      {
        active,
      },
    );
  }

  async renameApiKey(key: string, nombre: string): Promise<UpdateResult> {
    const apiKey = await getRepository(ApiKeyEntity).findOne({
      where: { key: key },
    });
    if (!apiKey) {
      throw new HttpException('No existe el api key', HttpStatus.NOT_FOUND);
    }
    return getRepository(ApiKeyEntity).update(
      { id: apiKey.id },
      {
        nombre,
      },
    );
  }
  /**
   * Se asegura que las sucursales tengan por lo menos un apikey
   *
   * @returns {ApiKeyEntity} array de apikeys creados
   */
  async asegurarApiKeys(): Promise<ApiKeyEntity[]> {
    const ss = await getRepository(SucursalEntity).find({
      where: { active: true },
      relations: ['apikeys'],
    });
    const as: ApiKeyEntity[] = [];
    for (let index = 0; index < ss.length; index++) {
      const s = ss[index];
      if (!s.apikeys.length) {
        as.push(
          await getRepository(ApiKeyEntity).save({
            sucursal: s,
            nombre: 'Default',
          }),
        );
      }
    }
    return as;
  }
}
