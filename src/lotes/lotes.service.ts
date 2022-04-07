import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { PaginationOptions } from '../common/DTO/paginationPrimeNg.dto';
import { CreateLoteDTO } from './DTOs/create-lote.dto';
import { LoteEntity } from './lotes.entity';
import { UpdateLoteDTO } from './DTOs/update-lote.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { forIn } from 'lodash';

@Injectable()
export class LotesService {
  /**
   * Crear un lote
   *
   * @param lote lote a crear
   * @returns {LoteEntity} registro creado
   */
  async create(lote: CreateLoteDTO): Promise<LoteEntity> {
    const createLote = plainToClass(LoteEntity, lote);
    return await getRepository(LoteEntity).save(createLote);
  }

  /**
   * Obtiene un lote por id
   *
   * @param id id del lote
   * @returns {LoteEntity}
   */
  async getById(id: number): Promise<LoteEntity> {
    const lote = await getRepository(LoteEntity).findOne(id);
    if (!lote) {
      throw new HttpException('El lote no existe', HttpStatus.NOT_FOUND);
    }
    return lote;
  }

  /**
   * Edita informacion de un lote
   *
   * @param id id del lote a actualizar
   * @param descripcion datos a actualizar
   * @returns {UpdateResult}
   */
  async update(id: number, updateLote: UpdateLoteDTO): Promise<UpdateResult> {
    const lote = await this.getById(id);
    if (!lote) {
      throw new HttpException('El lote no existe', HttpStatus.NOT_FOUND);
    }
    return await getRepository(LoteEntity).update({ id }, updateLote);
  }

  /**
   * elimina un lote
   *
   * @param id id del lote a eliminar
   * @returns {DeleteResult}
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(LoteEntity).delete({ id });
  }

  /**
   * Pagina los lotes
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(LoteEntity).createQueryBuilder('lote');
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('lote.numero like :term', {
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
