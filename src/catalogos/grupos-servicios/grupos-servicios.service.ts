import { PaginationPrimeNgResult } from './../../common/DTO/pagination-prime-Ng-result.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { GrupoServicioEntity } from './grupo-servicio.entity';
import { CreateGrupoServiciosDTO } from './DTOs/createGrupoServicio.dto';
import { UpdateGrupoServiciosDTO } from './DTOs/updateGrupoServicio.dto';
import { forIn } from 'lodash';

@Injectable()
export class GruposServiciosService {
  private readonly notFoundMessage = 'Grupo no encontrado';

  /**
   * Crea un grupo de servicios
   *
   * @param grupoServicios informacion del nuevo grupo de servicios
   * @returns grupo de servicios creado
   */
  async create(
    grupoServicios: CreateGrupoServiciosDTO,
  ): Promise<GrupoServicioEntity> {
    const GrupoServiciosToCreate = plainToClass(
      GrupoServicioEntity,
      grupoServicios,
    );
    return getRepository(GrupoServicioEntity).save(GrupoServiciosToCreate);
  }

  /**
   * obtiene un grupo por id
   *
   * @param id id del grupo de servicios
   * @returns grupo de servicios
   */
  async getById(id: number): Promise<GrupoServicioEntity> {
    const gruposervicio = await getRepository(GrupoServicioEntity).findOne({
      id,
    });
    if (!gruposervicio) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return gruposervicio;
  }

  /**
   * Actualiza un grupo de servicios
   *
   * @param id id del grupo de servicios a actualizar
   * @param grupo nuevos datos actualizados
   * @returns resultados de la actualizacion
   */
  async update(
    id: number,
    grupo: UpdateGrupoServiciosDTO,
  ): Promise<UpdateResult> {
    const grupoServicios = await this.getById(id);
    if (!grupoServicios) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(GrupoServicioEntity).update({ id }, grupo);
  }

  /**
   * Actualiza el estado de un grupo de servicios
   *
   * @param id id del grupo de servicios a actualizar estado
   * @param active estado de activacion true / false
   * @returns resultado de la actualizacion
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const grupoServicio = await this.getById(id);
    if (!grupoServicio) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }
    return await getRepository(GrupoServicioEntity)
      .createQueryBuilder('grupo')
      .update()
      .set({ active })
      .where({ id: grupoServicio.id })
      .execute();
  }

  /**
   * Elimina un grupo de servicios por id
   *
   * @param id id del grupo de servicios a eliminar
   * @returns resultados de la eliminación
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(GrupoServicioEntity).delete({ id });
  }

  /**
   * obtiene los grupos de servicios paginados
   *
   * @param options opciones de paginacion
   * @returns grupo de servicios paginado
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery =
      getRepository(GrupoServicioEntity).createQueryBuilder('grupoServicios');

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( grupoServicios.nombre LIKE :term )', {
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
