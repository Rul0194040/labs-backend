import { Injectable } from '@nestjs/common';
import { CreateIncentivoDTO } from './DTOs/create-incentivo.dto';
import { getRepository, UpdateResult } from 'typeorm';
import { IncentivoEntity } from './entity/incentivos.entity';
import { UpdateIncentivosDTO } from './DTOs/update-incentivo.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';

@Injectable()
export class IncentivosService {
  /**
   * Crear un incentivo
   *
   * @param incentivo datos del incentivo
   * @returns {IncentivoEntity}
   */
  async crearIncentivo(
    incentivo: CreateIncentivoDTO,
  ): Promise<IncentivoEntity> {
    return await getRepository(IncentivoEntity).save(incentivo);
  }

  /**
   * Actualizar un incentivo
   *
   * @param incentivoId Id del incentivo
   * @param incentivo datos del incentivo
   * @returns {UpdateResult}
   */
  async actualizarIncentivo(
    incentivoId: number,
    incentivo: UpdateIncentivosDTO,
  ): Promise<UpdateResult> {
    return await getRepository(IncentivoEntity).update(incentivoId, incentivo);
  }

  /**
   * leer incentivo
   *
   * @param incentivoId Id del incentivo
   */
  async getbyInsentivo(incentivoId: number): Promise<IncentivoEntity> {
    return await getRepository(IncentivoEntity).findOne(incentivoId);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(IncentivoEntity).createQueryBuilder();

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    if (options.sort === undefined || !Object.keys(options.sort).length) {
      options.sort = 'createdAt';
    }

    const count = await dataQuery.getCount();

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
