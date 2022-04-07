import { Injectable } from '@nestjs/common';
import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { EstatusCaja } from '@sanfrancisco/cajas/estatusCaja.enum';
import { getRepository } from 'typeorm';

@Injectable()
export class MovilService {
  /**
   * retorna todas las cajas abiertas
   *
   * @returns {CajaEntity[]}
   */
  async obtenerCajasAbiertas(): Promise<CajaEntity[]> {
    return await getRepository(CajaEntity)
      .createQueryBuilder('caja')
      .leftJoinAndSelect('caja.sucursal', 'sucursal')
      .leftJoinAndSelect('caja.usuario', 'usuario')
      .select([
        'caja.id',
        'caja.active',
        'caja.sucursalId',
        'caja.usuarioId',
        'caja.fechaApertura',
        'caja.notas',
        'caja.estatus',
        'caja.total',
        'caja.montoApertura',
        'sucursal.id',
        'sucursal.nombre',
        'sucursal.esMatriz',
        'sucursal.esLaboratorio',
        'sucursal.esForanea',
        'usuario.id',
        'usuario.email',
        'usuario.firstName',
        'usuario.lastName',
        'usuario.profile',
      ])
      .where('caja.estatus = :estatus', { estatus: EstatusCaja.ABIERTA })
      .getMany();
  }
}
