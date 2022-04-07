import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { TipoUnidadEntity } from './tipos-unidades.entity';
import { UpdateTiposUnidadesDTO } from './DTOs/updateTiposUnidades.dto';
import { plainToClass } from 'class-transformer';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { createTiposUnidadesDTO } from './DTOs/createTiposUnidades.dto';
import { forIn } from 'lodash';

@Injectable()
export class TiposUnidadesService {
  private readonly notFoundMessage = 'Grupo no encontrado';

  /**
   * Crea el tipo de unidad
   *
   * @param tipounidad tipo de unidad a crear
   * @returns {TipoUnidadEntity} el tipo de unidad creado
   */
  async create(tipounidad: createTiposUnidadesDTO): Promise<TipoUnidadEntity> {
    const tipounidadToCreate = plainToClass(TipoUnidadEntity, tipounidad);
    return getRepository(TipoUnidadEntity).save(tipounidadToCreate);
  }

  /**
   * Retorna un tipo de unidad por id
   *
   * @param id id del tipo de unidad
   * @returns {TipoUnidadEntity} tipo de unidad consultado por id
   */
  async getById(id: number): Promise<TipoUnidadEntity> {
    const tipounidad = await getRepository(TipoUnidadEntity).findOne({
      id,
    });
    if (!tipounidad) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return tipounidad;
  }

  /**
   * Actualiza la informacion de un tipo de unidad
   *
   * @param id id del tipo de unidad a actualizar
   * @param tipo nuevos valores
   * @returns {UpdateResult} resultado de la actualizacion
   */
  async update(
    id: number,
    tipo: UpdateTiposUnidadesDTO,
  ): Promise<UpdateResult> {
    const tipounidad = await this.getById(id);
    if (!tipounidad) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoUnidadEntity).update({ id }, tipo);
  }

  /**
   * Actualiza el estado de un tipo de unidad
   *
   * @param id id del tipo de unidad a cambiar el status
   * @param active estado de activacion true / false
   * @returns {UpdateResult} resultados de la actualizacion
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const tipounidad = await this.getById(id);
    if (!tipounidad) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoUnidadEntity)
      .createQueryBuilder('grupo')
      .update()
      .set({ active })
      .where({ id: tipounidad.id })
      .execute();
  }

  /**
   * Elimina un tipo de unidad por id
   *
   * @param id id del tipo de unidad
   * @returns {DeleteResult} resultado de la eliminacion
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(TipoUnidadEntity).delete({ id });
  }

  /**
   * Pagina los tipos de unidads
   *
   * @param options opciones de paginacion
   * @returns tipos de unidads paginados
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(TipoUnidadEntity).createQueryBuilder(
      'tipounidad',
    );

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( tipounidad.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    if (options.sort === undefined) {
      options.sort = 'createdAt';
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
}
