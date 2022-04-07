import { PaginationPrimeNgResult } from './../common/DTO/pagination-prime-Ng-result.dto';
import { DeleteResult, UpdateResult, getRepository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServicioDTO } from './DTOs/createServicio.dto';
import { UpdateServicioDTO } from './DTOs/updateServicio.dto';
import { ServicioEntity } from './servicio.entity';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { ServiciosInsumosEntity } from './servicios-insumos.entity';
import { CreateServiciosInsumosDTO } from './DTOs/createServicioInsumo.dto';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { forIn } from 'lodash';
import {
  UpdateServiceCatalogsDTO,
  UpdateServiceCatalogsEntityDTO,
} from './DTOs/updateServiceCatalogs.dto';
import { GrupoServicioEntity } from '../catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoMuestraEntity } from '../catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from '../catalogos/tipos-unidades/tipos-unidades.entity';
import { PxlabService } from '@sanfrancisco/pxlab/pxlab.service';
import * as readXlsxFile from 'read-excel-file/node';
import { MyLogger } from '@sanfrancisco/logger';

@Injectable()
export class ServiciosService {
  private logger = new MyLogger(ServiciosService.name);
  constructor(private readonly pxService: PxlabService) {}
  /**
   *Crear servicio
   * @param servicio
   */
  async create(servicio: CreateServicioDTO): Promise<ServicioEntity> {
    const servicioToCreate = plainToClass(ServicioEntity, servicio);
    const servicioCreated = await getRepository(ServicioEntity).save(
      servicioToCreate,
    );
    //ponerle la clave PX de Xquenda
    const clave = '9' + servicioCreated.id.toString().padStart(6, '0');
    await getRepository(ServicioEntity).update(servicioCreated.id, {
      clave,
    });
    servicioCreated.clave = clave;
    this.pxService.enviarEstudio(clave, servicioCreated.nombre);
    return servicioCreated;
  }

  /**
   * Buscar un servicio por id
   * @param id del servicio a buscar
   */

  async getById(id: number): Promise<ServicioEntity> {
    const servicio = getRepository(ServicioEntity)
      .createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.tipoMuestra', 'tipoMuestra')
      .leftJoinAndSelect('servicio.tipoUnidad', 'tipoUnidad')
      .leftJoinAndSelect('servicio.grupoServicio', 'grupoServicio')
      .where('servicio.id = :servicioId', { servicioId: id })
      .getOne();

    if (!servicio) {
      throw new HttpException('Este servicio no existe', HttpStatus.NOT_FOUND);
    }

    return servicio;
  }
  /**
   * Actualizar un objeto servicio
   * @param id del objeto a actualizar
   * @param data para actualizar el objeto
   */
  async update(id: number, data: UpdateServicioDTO): Promise<UpdateResult> {
    const resultUpdate = await getRepository(ServicioEntity)
      .createQueryBuilder()
      .update()
      .set({
        clave: data.clave,
        nombre: data.nombre,
        precio: data.precio,
        precio2: data.precio2,
        precio3: data.precio3,
        realizaEstudioEn: data.realizaEstudioEn,
        recomendaciones: data.recomendaciones,
        muestrasRequeridas: data.muestrasRequeridas,
        sinonimo1: data.sinonimo1,
        sinonimo2: data.sinonimo2,
        precioMaquila: data.precioMaquila,
      })
      .where('id=:id', { id })
      .execute();
    if (resultUpdate.affected) {
      this.pxService.enviarEstudio(data.clave, data.nombre, false);
    }
    return resultUpdate;
  }

  /**
   * Actualiza catalogos del servicio
   *
   * @param id id del servicio
   * @param catalogs catalogos a actualizar
   * @returns resultados de actualizacion
   */
  async updateServiceCatalogs(
    id: number,
    catalogs: UpdateServiceCatalogsDTO,
  ): Promise<UpdateResult> {
    let grupoServicio = null;
    let tipoMuestra = null;
    let tipoUnidad = null;
    const updateCatalogs: UpdateServiceCatalogsEntityDTO = {};

    if (catalogs.grupoServicio) {
      grupoServicio = await getRepository(GrupoServicioEntity).findOne({
        id: catalogs.grupoServicio,
      });
      if (!grupoServicio)
        throw new HttpException(
          'Grupo de servicios no encontrado',
          HttpStatus.NOT_FOUND,
        );
      updateCatalogs.grupoServicio = grupoServicio;
    }

    if (catalogs.tipoMuestra) {
      tipoMuestra = await getRepository(TipoMuestraEntity).findOne({
        id: catalogs.tipoMuestra,
      });
      if (!tipoMuestra)
        throw new HttpException(
          'tipo de muestra no encontrado',
          HttpStatus.NOT_FOUND,
        );
      updateCatalogs.tipoMuestra = tipoMuestra;
    }

    if (catalogs.tipoUnidad) {
      tipoUnidad = await getRepository(TipoUnidadEntity).findOne({
        id: catalogs.tipoUnidad,
      });
      if (!tipoUnidad)
        throw new HttpException(
          'tipo de unidad no encontrado',
          HttpStatus.NOT_FOUND,
        );
      updateCatalogs.tipoUnidad = tipoUnidad;
    }

    return await getRepository(ServicioEntity)
      .createQueryBuilder()
      .update()
      .set(updateCatalogs)
      .where('id=:id', { id })
      .execute();
  }

  /**
   * Borrar un objeto servicio
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return await getRepository(ServicioEntity).delete({ id });
  }
  /**
   * Paginar servicios
   * @param options para paginar los servicios
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(ServicioEntity)
      .createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.grupoServicio', 'grupoServicio')
      .leftJoinAndSelect('servicio.tipoMuestra', 'tipoMuestra')
      .leftJoinAndSelect('servicio.tipoUnidad', 'tipoUnidad')
      .select([
        'servicio',
        'grupoServicio.id',
        'grupoServicio.nombre',
        'tipoMuestra.id',
        'tipoMuestra.nombre',
        'tipoUnidad.id',
        'tipoUnidad.nombre',
      ]);

    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        // filtro de servicio por nombre, sinonimo1 y sinonimo2
        dataQuery.andWhere('( servicio.nombre LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( servicio.sinonimo1 LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( servicio.sinonimo2 LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
        dataQuery.orWhere('( servicio.clave LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.sort)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }
  /**
   * Crear objeto insumo-servicio
   * @param insumosToAdd data para crear  objeto insumo-servicio
   */
  async agregarInsumo(
    idServicio: number,
    insumosToAdd: CreateServiciosInsumosDTO,
  ): Promise<ServiciosInsumosEntity> {
    const servicio = await getRepository(ServicioEntity)
      .createQueryBuilder()
      .where('id=:id', {
        id: idServicio,
      })
      .getOne();

    if (!servicio) {
      throw new HttpException('El servicio no existe', HttpStatus.NOT_FOUND);
    }

    const insumo = await getRepository(InsumoEntity)
      .createQueryBuilder()
      .where('id=:id', {
        id: insumosToAdd.insumo,
      })
      .getOne();

    if (!insumo) {
      throw new HttpException('Ese insumo no existe', HttpStatus.NOT_FOUND);
    }

    const existeServicioInsumo = await getRepository(ServiciosInsumosEntity)
      .createQueryBuilder('serviciosInsumos')
      .leftJoin('serviciosInsumos.insumo', 'insumo')
      .leftJoin('serviciosInsumos.servicio', 'servicio')
      .where('insumo.id=:insumoId', { insumoId: insumo.id })
      .andWhere('servicio.id=:servicioId', { servicioId: servicio.id })
      .getOne();

    if (existeServicioInsumo) {
      throw new HttpException(
        'El insumo ya existe en el servicio',
        HttpStatus.BAD_REQUEST,
      );
    }

    const InsumoToCreate = {
      servicio: servicio,
      insumo: insumo,
      cantidad: insumosToAdd.cantidad,
    };

    return getRepository(ServiciosInsumosEntity).save(InsumoToCreate);
  }
  /**
   * Borrar un objeto de insumo-servicio
   * @param id del objeto insumo-servicio
   */
  async quitarInsumo(servicioInsumoId: number): Promise<DeleteResult> {
    const query = await getRepository(ServiciosInsumosEntity)
      .createQueryBuilder()
      .where('id=:servicioInsumoId', { servicioInsumoId })
      .getOne();

    if (!query) {
      throw new HttpException(
        'Este servicio-insumo no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    return await getRepository(ServiciosInsumosEntity).delete(query.id);
  }

  /**
   * Traer un objeto de insumo-servicio by servicio
   * @param id del objeto insumo-servicio
   */
  async InsumoByServicio(servicioId: number): Promise<ServiciosInsumosEntity> {
    const query = await getRepository(ServiciosInsumosEntity)
      .createQueryBuilder('servicioInsumo')
      .leftJoinAndSelect('servicioInsumo.servicio', 'servicio')
      .leftJoinAndSelect('servicioInsumo.insumo', 'insumo')
      .where('servicio.id=:id', { id: servicioId })
      .getOne();

    if (!query) {
      throw new HttpException(
        'Este servicio-insumo no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    return query;
  }

  /**
   * Paginar objetos insumos-servicios
   * @param options para paginar los objetos insumos-servicios
   */
  async paginateServicioInsumo(
    idServicio: number,
    options: PaginationOptions,
  ): Promise<any> {
    const dataQuery = getRepository(ServiciosInsumosEntity)
      .createQueryBuilder('insumoservicio')
      .leftJoin('insumoservicio.servicio', 'servicio')
      .leftJoin('insumoservicio.insumo', 'insumo')
      .leftJoin('insumo.tipoInsumo', 'tipoInsumo')
      .leftJoin('insumo.tipoUnidad', 'tipoUnidad')
      .select([
        'insumoservicio',
        'insumo',
        'tipoInsumo.id',
        'tipoInsumo.nombre',
        'tipoUnidad',
      ])
      .where('servicio.id=:idServicio', { idServicio: idServicio });

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

  async importarServiciosXLS(xlsFile: string) {
    this.logger.verbose('Abriendo archivo ' + xlsFile);
    const rows = await readXlsxFile(xlsFile, { dateFormat: 'MM/DD/YY' });
    this.logger.verbose('Encontrados ' + rows.length + ' servicios');

    //por cada row de datos
    for (let r = 1; r <= rows.length - 1; r++) {
      const row = rows[r];
      const clave = row[0] ? row[0].toString() : null;
      const nombre = row[1] ? row[1] : null;
      const sinonimo1 = row[2] ? row[2] : null;
      const sinonimo2 = row[3] ? row[3] : null;
      const tipoMuestra = row[4] ? row[4] : null;
      const tiempo = row[5] ? row[5] : null;
      const precio1 = row[8] ? row[8] : 0;
      const precioMaquila = row[9] ? row[9] : 0;
      const precio3 = row[10] ? row[10] : 0;

      //es un insumo existente y trae cantidad
      if (clave && nombre) {
        const servicio = await getRepository(ServicioEntity).findOne({ clave });

        if (!servicio) {
          //si no existe, darlo de alta
          const servicioCreado = await getRepository(ServicioEntity).save({
            clave,
            nombre,
            sinonimo1,
            sinonimo2,
            tiempo,
            precio: precio1,
            precio2: precio1,
            precioMaquila: precioMaquila,
            precio3: precio3,
          });
          this.logger.verbose('+++Creado: ' + servicioCreado.nombre);
        } else {
          //actualizarlo
          await getRepository(ServicioEntity).update(
            { clave },
            {
              nombre,
              sinonimo1,
              sinonimo2,
              tipoMuestra,
              tiempo,
              precio: precio1,
              precio2: precio1,
              precioMaquila: precioMaquila,
              precio3: precio3,
            },
          );
        }
      }
    }
    return rows;
  }
}
