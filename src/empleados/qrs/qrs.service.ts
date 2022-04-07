import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { getRepository } from 'typeorm';
import { QrsEntity } from './qrs.entity';

@Injectable()
export class QrsService {
  //proviene desde events.gategay
  //generar y/u obtener un codigo qr disponible para una sucurasl
  //si ya existe uno disponible, retornar ese.
  async generarQr(sucursalId): Promise<QrsEntity> {
    const qrRepo = getRepository(QrsEntity);
    const existente = await qrRepo
      .createQueryBuilder('q')
      .leftJoin('q.sucursal', 's')
      .leftJoin('q.empleado', 'e')
      .where('s.id = :sId', { sId: sucursalId })
      .andWhere('e.id IS NULL')
      .getOne();
    return existente
      ? existente
      : await qrRepo.save({
          sucursalId,
        });
  }

  async quemarQr(
    uuid: string,
    empleadoId: number, //de sesion quien quema el codigo
    entrada: QrsEntity,
    lat: string,
    lng: string,
  ): Promise<QrsEntity> {
    await getRepository(QrsEntity)
      .createQueryBuilder()
      .update()
      .set({
        empleadoId,
        entrada,
        lat,
        lng,
        fechaHora: moment().format('YYYY-MM-DD H:m:s'),
      })
      .where('uuid=:elUuid', { elUuid: uuid })
      .execute();
    return getRepository(QrsEntity).findOne({ uuid });
  }

  async getByUuid(uuid: string): Promise<QrsEntity> {
    return await getRepository(QrsEntity).findOne({
      where: { uuid },
      relations: ['sucursal'],
    });
  }
}
