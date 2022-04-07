import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { CreateTipoMuestraDTO } from './DTOs/createTiposMuestras.dto';
import { TipoMuestraEntity } from './tipos-muestras.entity';
import { UpdateTipoMuestraDTO } from './DTOs/updateTiposMuestras.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';

@Injectable()
export class TiposMuestrasService {
  private readonly notFoundMessage = 'Grupo no encontrado';

  /**
   * Crea el tipo de muestra
   *
   * @param tipoMuestra tipo de muestra a crear
   * @returns {TipoMuestraEntity} el tipo de muestra creado
   */
  async create(tipoMuestra: CreateTipoMuestraDTO): Promise<TipoMuestraEntity> {
    const tipoMuestraToCreate = plainToClass(TipoMuestraEntity, tipoMuestra);
    return getRepository(TipoMuestraEntity).save(tipoMuestraToCreate);
  }

  /**
   * Retorna un tipo de muestra por id
   *
   * @param id id del tipo de muestra
   * @returns {TipoMuestraEntity} tipo de muestra consultado por id
   */
  async getById(id: number): Promise<TipoMuestraEntity> {
    const tipoMuestra = await getRepository(TipoMuestraEntity).findOne({
      id,
    });
    if (!tipoMuestra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return tipoMuestra;
  }

  /**
   * Actualiza la informacion de un tipo de muestra
   *
   * @param id id del tipo de muestra a actualizar
   * @param tipo nuevos valores
   * @returns {UpdateResult} resultado de la actualizacion
   */
  async update(id: number, tipo: UpdateTipoMuestraDTO): Promise<UpdateResult> {
    const tipoMuestra = await this.getById(id);
    if (!tipoMuestra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoMuestraEntity).update({ id }, tipo);
  }

  /**
   * Actualiza el estado de un tipo de muestra
   *
   * @param id id del tipo de muestra a cambiar el status
   * @param active estado de activacion true / false
   * @returns {UpdateResult} resultados de la actualizacion
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const tipoMuestra = await this.getById(id);
    if (!tipoMuestra) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(TipoMuestraEntity)
      .createQueryBuilder('grupo')
      .update()
      .set({ active })
      .where({ id: tipoMuestra.id })
      .execute();
  }

  /**
   * Elimina un tipo de muestra por id
   *
   * @param id id del tipo de muestra
   * @returns {DeleteResult} resultado de la eliminacion
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(TipoMuestraEntity).delete({ id });
  }

  /**
   * Pagina los tipos de muestras
   *
   * @param options opciones de paginacion
   * @returns tipos de muestras paginados
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(TipoMuestraEntity).createQueryBuilder(
      'tipoMuestra',
    );

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( tipoMuestra.nombre LIKE :term )', {
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
