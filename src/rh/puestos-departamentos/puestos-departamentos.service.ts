import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDepartamentoDTO } from './DTOs/create-departamento.dto';
import { CreatePuestoDTO } from './DTOs/create-puesto.dto';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { DepartamentoEntity } from './entity/departamento.entity';
import { PuestoEntity } from './entity/puesto.entity';
import { UpdateDepartamentoDTO } from './DTOs/update-departamento.dto';
import { UpdatePuestoDTO } from './DTOs/update-puesto.dto';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { forIn } from 'lodash';

@Injectable()
export class PuestosDepartamentosService {
  /**
.########..########.########..########..#######...######.
.##.....##.##.......##.....##....##....##.....##.##....##
.##.....##.##.......##.....##....##....##.....##.##......
.##.....##.######...########.....##....##.....##..######.
.##.....##.##.......##...........##....##.....##.......##
.##.....##.##.......##...........##....##.....##.##....##
.########..########.##...........##.....#######...######.
  */

  /**
   * Crear departamento
   *
   * @param departamento Data del departamento
   * @returns {DepartamentoEntity}
   */
  async crearDepartamento(
    departamento: CreateDepartamentoDTO,
  ): Promise<DepartamentoEntity> {
    let parent = null;
    if (departamento.parentId) {
      parent = await getRepository(DepartamentoEntity).findOne(
        departamento.parentId,
      );
    }

    return await getRepository(DepartamentoEntity).save({
      nombre: departamento.nombre,
      parent,
    });
  }

  /**
   * Actualizar un departamento
   *
   * @param departamentoId Id del departamento
   * @param departamento datos a actualizar del departamento
   * @returns {UpdateResult}
   */
  async actualizarDepartamento(
    departamentoId: number,
    departamento: UpdateDepartamentoDTO,
  ): Promise<UpdateResult> {
    const dep = await this.getDepartamentoById(departamentoId);
    return await getRepository(DepartamentoEntity).update(dep.id, departamento);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  async departamentosPaginate(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(DepartamentoEntity)
      .createQueryBuilder('depto')
      .leftJoin('depto.parent', 'parent')
      .select(['depto', 'parent.id', 'parent.nombre']);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( depto.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    if (options.sort === undefined || !Object.keys(options.sort).length) {
      options.sort = 'depto.createdAt';
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

  /**
   * Get by id
   *
   * @param id
   * @returns {DepartamentoEntity}
   */
  async getDepartamentoById(id: number): Promise<DepartamentoEntity> {
    const departamento = await getRepository(DepartamentoEntity)
      .createQueryBuilder('depto')
      .leftJoin('depto.parent', 'parent')
      .select(['depto', 'parent.id', 'parent.nombre'])
      .where('depto.id=:id', { id })
      .getOne();
    if (!departamento) {
      throw new HttpException(
        'Departamento no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return departamento;
  }

  /**
   * borrar un departamento
   *
   * @param departamentoId Id del departamento
   * @param departamento datos a actualizar del departamento
   * @returns {UpdateResult}
   */
  async deleteDepartamento(departamentoId: number): Promise<DeleteResult> {
    const dep = await this.getDepartamentoById(departamentoId);
    return await getRepository(DepartamentoEntity).delete(dep.id);
  }

  /**
.########..##.....##.########..######..########..#######...######.
.##.....##.##.....##.##.......##....##....##....##.....##.##....##
.##.....##.##.....##.##.......##..........##....##.....##.##......
.########..##.....##.######....######.....##....##.....##..######.
.##........##.....##.##.............##....##....##.....##.......##
.##........##.....##.##.......##....##....##....##.....##.##....##
.##.........#######..########..######.....##.....#######...######.
 */
  /**
   * Crear puesto
   *
   * @param puesto Data del puesto
   * @returns {PuestoEntity}
   */
  async crearPuesto(puesto: CreatePuestoDTO): Promise<PuestoEntity> {
    let puestoJefe = null;
    if (puesto.puestoJefeId) {
      puestoJefe = await getRepository(PuestoEntity).findOne(
        puesto.puestoJefeId,
      );
    }

    let departamento = null;
    if (puesto.departamentoId) {
      departamento = await getRepository(DepartamentoEntity).findOne(
        puesto.departamentoId,
      );
    }

    return await getRepository(PuestoEntity).save({
      nombre: puesto.nombre,
      puestoJefe,
      sueldoMensual: puesto.sueldoMensual,
      plazasDisponibles: puesto.plazasDisponibles,
      departamento,
    });
  }

  /**
   * Actualizar un puesto
   *
   * @param puestoId id del puesto
   * @param puesto datos a actualizar del puesto
   * @returns {UpdateResult}
   */
  async actualizarPuesto(
    puestoId: number,
    puesto: UpdatePuestoDTO,
  ): Promise<UpdateResult> {
    const puestoE = await this.getPuestoById(puestoId);
    return await getRepository(PuestoEntity).update(puestoE.id, puesto);
  }

  /**
   * Paginate
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult}
   */
  async puestosPaginate(
    options: PaginationOptions,
  ): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(PuestoEntity)
      .createQueryBuilder('puesto')
      .leftJoin('puesto.puestoJefe', 'puestoJefe')
      .leftJoin('puesto.departamento', 'departamento')
      .select([
        'puesto.id',
        'puesto.createdAt',
        'puestoJefe.id',
        'puestoJefe.nombre',
        'departamento.id',
        'departamento.nombre',
      ]);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( puesto.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    if (options.sort === undefined || !Object.keys(options.sort).length) {
      options.sort = 'puesto.createdAt';
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

  /**
   * Get by id
   *
   * @param id
   * @returns {PuestoEntity}
   */
  async getPuestoById(id: number): Promise<PuestoEntity> {
    const puesto = await getRepository(PuestoEntity)
      .createQueryBuilder('puesto')
      .leftJoin('puesto.departamento', 'departamento')
      .leftJoin('puesto.puestoJefe', 'jefe')
      .select(['puesto', 'departamento', 'jefe'])
      .where('puesto.id =:id', { id })
      .getOne();
    if (!puesto) {
      throw new HttpException('Puesto no encontrado', HttpStatus.NOT_FOUND);
    }
    return puesto;
  }

  /**
   * Get by id
   *
   * @param id
   * @returns {PuestoEntity}
   */
  async puestosDelete(id: number): Promise<DeleteResult> {
    return await getRepository(PuestoEntity).delete(id);
  }
}
