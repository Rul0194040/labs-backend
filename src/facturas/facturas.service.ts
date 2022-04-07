import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationPrimeNgResult } from '@sanfrancisco/common/DTO/pagination-prime-Ng-result.dto';
import { PaginationOptions } from '@sanfrancisco/common/DTO/paginationPrimeNg.dto';
import { plainToClass } from 'class-transformer';
import { forIn } from 'lodash';
import { getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { DatosFacturaDTO } from './dto/datos-factura.dto';
import { FacturaEntity } from './facturas.entity';
import { UpdateFacturaDTO } from './dto/update-factura.dto';

@Injectable()
export class FacturasService {
  private readonly notFoundMessage = 'factura no encontrada';

  async create(factura: DatosFacturaDTO): Promise<FacturaEntity> {
    const facturaToCreate = plainToClass(FacturaEntity, factura);

    return getRepository(FacturaEntity).save(facturaToCreate);
  }
  async getById(id: number): Promise<FacturaEntity> {
    const factura = getRepository(FacturaEntity)
      .createQueryBuilder('factura')
      .where('factura.id = :id', { id: id })
      .getOne();

    if (!factura) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return factura;
  }

  async update(id: number, factura: UpdateFacturaDTO): Promise<UpdateResult> {
    const thefactura = await this.getById(id);

    if (!thefactura) {
      throw new HttpException(this.notFoundMessage, HttpStatus.NOT_FOUND);
    }

    return await getRepository(FacturaEntity).update({ id }, factura);
  }

  // async solicitarFactura(
  //   id: number,
  //   solicitud: SolicitudFacturaDTO,
  // ): Promise<UpdateResult> {}
  //TODO api service publica para buscar la factua del cliente

  async delete(id: number): Promise<DeleteResult> {
    return getRepository(FacturaEntity).delete({ id });
  }

  async paginate(options: PaginationOptions): Promise<PaginationPrimeNgResult> {
    const dataQuery = getRepository(FacturaEntity).createQueryBuilder(
      'factura',
    );
    forIn(options.filters, (value, key) => {
      if (key === 'nombre') {
        dataQuery.andWhere('( factura.constribuyente LIKE :term )', {
          term: `%${value.split(' ').join('%')}%`,
        });
      }
    });

    const count = await dataQuery.getCount();

    const data = await dataQuery
      .skip(options.skip)
      .take(options.take)
      .getMany();

    return {
      data: data,
      skip: options.skip,
      totalItems: count,
    };
  }
}
