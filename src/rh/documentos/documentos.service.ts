import { DocumentoEntity } from './entity/documento.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { CreateDocumentoDto } from './Dtos/create-documento.dto';
import { UpdateDocumentoDto } from './Dtos/update-documento.dto';

@Injectable()
export class DocumentosService {
  /**
   * Crea un nuevo documento en la base de datos
   *
   * @param documento documento a crear
   * @returns {SucursalEntity} entidad de documento
   */
  async create(documento: CreateDocumentoDto): Promise<DocumentoEntity> {
    const documentoToCreate = plainToClass(DocumentoEntity, documento);

    const nuevoDocumento = await getRepository(DocumentoEntity).save(
      documentoToCreate,
    );

    return nuevoDocumento;
  }
  /**
   * Retorna un documento por id
   * @param id
   */
  async getById(id: number): Promise<DocumentoEntity> {
    const documento = getRepository(DocumentoEntity).findOne(id);

    if (!documento) {
      throw new HttpException('documento no encontrado', HttpStatus.NOT_FOUND);
    }

    return documento;
  }
  /**
   * Actualiza un registro de documento
   *
   * @param id del documento a actualizar
   * @param documento data que actualiza el objeto
   */
  async update(
    id: number,
    documento: UpdateDocumentoDto,
  ): Promise<UpdateResult> {
    const Record = await this.getById(id);

    if (!Record) {
      throw new HttpException('documento no encontrado', HttpStatus.NOT_FOUND);
    }

    const documentoActualizado = await getRepository(DocumentoEntity).update(
      { id },
      documento,
    );

    return documentoActualizado;
  }

  /**
   * Borra un registro
   *
   * @param id del objeto a borrar
   */
  async delete(id: number): Promise<DeleteResult> {
    return getRepository(DocumentoEntity).delete({ id });
  }

  /**
   * Pagina los insumos activos
   * @param options opciones de paginacion de los registros
   */
  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(DocumentoEntity)
      .createQueryBuilder('documento')
      .select(['documento.nombre', 'documento.fileName']);
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( documento.nombre LIKE :term )', {
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
