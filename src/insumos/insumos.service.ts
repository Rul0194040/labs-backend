import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateInsumoDTO } from './DTOs/createInsumo.dto';
import { UpdateInsumoDTO } from './DTOs/updateInsumo.dto';
import { InsumoEntity } from './insumo.entity';
import { forIn } from 'lodash';

@Injectable()
export class InsumosService {
  private readonly notFoundMessage = 'Insumo no encontrada';

  /**
   * Crea un nuevo insumo en la base de datos
   *
   * @param insumo insumo a crear
   * @returns {SucursalEntity} entidad de insumo
   */
  async create(insumo: CreateInsumoDTO): Promise<InsumoEntity> {
    const tipoInsumo = await getRepository(TipoInsumoEntity).findOne({
      id: insumo.tipoInsumo,
    });

    const tipoUnidad = await getRepository(TipoInsumoEntity).findOne({
      id: insumo.tipoUnidad,
    });

    const insumoToCreate = plainToClass(InsumoEntity, insumo);
    insumoToCreate.tipoInsumo = tipoInsumo;
    insumoToCreate.tipoUnidad = tipoUnidad;

    return getRepository(InsumoEntity).save(insumoToCreate);
  }
  /**
   * Retorna un insumo por id
   * @param id
   */
  async getById(id: number): Promise<InsumoEntity> {
    const insumo = getRepository(InsumoEntity)
      .createQueryBuilder('insumo')
      .leftJoinAndSelect('insumo.tipoInsumo', 'tipoInsumo')
      .leftJoinAndSelect('insumo.tipoUnidad', 'tipoUnidad')
      .where('insumo.id = :insumoId', { insumoId: id })
      .getOne();

    if (!insumo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return insumo;
  }
  /**
   * Actualiza un registro de insumo
   *
   * @param id del insumo a actualizar
   * @param insumo data que actualiza el objeto
   */
  async update(id: number, insumo: UpdateInsumoDTO): Promise<UpdateResult> {
    const theInsumo = await this.getById(id);

    if (!theInsumo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(InsumoEntity)
      .createQueryBuilder()
      .update()
      .set({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion,
        descuentaEn: insumo.descuentaEn,
        clave: insumo.clave,
        tipoInsumoId: insumo.tipoInsumoId,
        tipoUnidadId: insumo.tipoUnidadId,
      })
      .where('id=:id', { id })
      .execute();
  }
  /**
   * Cambia el estatus de un insumo
   *
   * @param id del objeto a cambiar el status
   * @param active referencia del valor del status
   */
  async updateStatus(id: number, active: boolean): Promise<UpdateResult> {
    const theInsumo = await this.getById(id);

    if (!theInsumo) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(InsumoEntity)
      .createQueryBuilder('insumo')
      .update()
      .set({ active })
      .where({ id: theInsumo.id })
      .execute();
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(InsumoEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(InsumoEntity)
      .createQueryBuilder('insumo')
      .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
      .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
      .select([
        'insumo',
        'tipoInsumo.id',
        'tipoInsumo.nombre',
        'tipoUnidad.id',
        'tipoUnidad.nombre',
      ]);
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( insumo.nombre LIKE :term )', {
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
