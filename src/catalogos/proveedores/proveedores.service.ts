import { Injectable } from '@nestjs/common';
import { CreateProveedorDTO } from './DTOs/createProveedor.dto';
import { UpdateProveedorDTO } from './DTOs/updateProveedor.dto';
import { PaginationOptions } from '../../common/DTO/paginationPrimeNg.dto';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import { ProveedorEntity } from './proveedores.entity';
import { plainToClass } from 'class-transformer';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { forIn } from 'lodash';

@Injectable()
export class ProveedoresService {
  /**
   * Retorna un proveedor por id
   *
   * @param id id del proveedor
   * @returns {ProveedorEntity} proveedor
   */
  async getById(id: number): Promise<ProveedorEntity> {
    return await getRepository(ProveedorEntity).findOne({ id });
  }

  /**
   * Crear un proveedor
   *
   * @param data información del proveedor a guardar
   * @returns {ProveedorEntity} proveedor creado
   */
  async create(data: CreateProveedorDTO): Promise<ProveedorEntity> {
    const proveedor = plainToClass(ProveedorEntity, data);
    const proveedorCreado = getRepository(ProveedorEntity).save(proveedor);
    return proveedorCreado;
  }

  /**
   * Actualiza la informacion de un proveedor
   *
   * @param id id del proveedor a actualizar
   * @param data informacion actualizada
   * @returns {UpdateResult} Resultados de la actualizacion
   */
  async update(id: number, data: UpdateProveedorDTO): Promise<UpdateResult> {
    return await getRepository(ProveedorEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where('id=:id', { id })
      .execute();
  }

  /**
   * Elimina un proveedor por id
   *
   * @param id id del proveedor a eliminar
   * @returns {DeleteResult} resultados de la eliminación
   */
  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(ProveedorEntity).delete(id);
  }

  /**
   * Pagina proveedores
   *
   * @param options opciones de paginacion
   * @returns {PaginationPrimeNgResult} resultados paginados
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery =
      getRepository(ProveedorEntity).createQueryBuilder('proveedor');
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( proveedor.nombre LIKE :term )', {
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
