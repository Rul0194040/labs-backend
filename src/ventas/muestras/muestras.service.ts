import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersEntity } from '../../users/users.entity';
import { CreateMuestraDTO } from './DTOs/create-muestra.dto';
import { DeleteResult, getRepository } from 'typeorm';
import { DetalleVentasEntity } from '../ventasDetalle.entity';
import { MuestraEntity } from './muestras.entity';

@Injectable()
export class MuestrasService {
  async create(
    usuario: UsersEntity,
    data: CreateMuestraDTO,
  ): Promise<MuestraEntity> {
    const ventaDetalle = await getRepository(DetalleVentasEntity).findOne(
      data.ventaDetalleId,
    );

    if (!ventaDetalle)
      throw new HttpException(
        'Detalle de venta no encontrado',
        HttpStatus.NOT_FOUND,
      );

    const muestraCrear = {
      ventaDetalle,
      usuario,
      notas: data.notas,
    };
    return await getRepository(MuestraEntity).save(muestraCrear);
  }

  async delete(id: number): Promise<DeleteResult> {
    return getRepository(MuestraEntity).delete(id);
  }
}
