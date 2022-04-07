import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { CreateTipoInsumoDTO } from './DTOs/createTipoInsumo.dto';
import { UpdateTipoInsumoDTO } from './DTOs/updateTipoInsumo.dto';
import { TipoInsumoEntity } from './tipo-insumo.entity';

@Injectable()
export class TiposInsumosService {
  private readonly notFoundMessage = 'Tipo no encontrado';

  /**
   * Crea un tipo de insumos
   *
   * @param TipoInsumo informacion del nuevo grupo de servicios
   * @returns tipo de ensumo creado
   */
  async create(tipoInsumo: CreateTipoInsumoDTO): Promise<TipoInsumoEntity> {
    const tipoInsumoToCreate = plainToClass(TipoInsumoEntity, tipoInsumo);
    return getRepository(TipoInsumoEntity).save(tipoInsumoToCreate);
  }

  /**
   * obtiene un tipo por id
   *
   * @param id id del tipo de insumo
   * @returns tipo de insumo
   */
  async getById(id: number): Promise<TipoInsumoEntity> {
    const tipoInsumo = await getRepository(TipoInsumoEntity).findOne({
      id,
    });
    if (!tipoInsumo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return tipoInsumo;
  }

  /**
   * Actualiza el tipo de insumo
   *
   * @param id id del tipo de insumo a actualizar
   * @param data nuevos datos actualizados
   * @returns resultados de la actualizacion
   */
  async update(id: number, data: UpdateTipoInsumoDTO): Promise<UpdateResult> {
    const tipoInsumo = await this.getById(id);
    if (!tipoInsumo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoInsumoEntity).update({ id }, data);
  }

  /**
   * Actualiza el estado de un tipo de Insumo
   *
   * @param id id del tipo de insumo a actualizar estado
   * @param active estado de activacion true / false
   * @returns resultado de la actualizacion
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const tipoInusmo = await this.getById(id);
    if (!tipoInusmo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoInsumoEntity)
      .createQueryBuilder('tipo')
      .update()
      .set({ active })
      .where({ id: tipoInusmo.id })
      .execute();
  }

  /**
   * Elimina un tipo de insumo por id
   *
   * @param id id del tipo de insumo a eliminar
   * @returns resultados de la eliminación
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(TipoInsumoEntity).delete({ id });
  }

  /**
   * obtiene los tipos de insumo paginados
   *
   * @param options opciones de paginacion
   * @returns grupo de servicios paginado
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(TipoInsumoEntity).createQueryBuilder(
      'tipoInsumo',
    );

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( tipoInsumo.nombre LIKE :term )', {
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
