import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Seeder } from 'nestjs-seeder';
import { getRepository } from 'typeorm';
import { ServicioEntity } from './servicio.entity';
import { ServiciosToCreate } from './servicios.collection';

/**
 * @ignore
 */
@Injectable()
export class ServiciosSeeder implements Seeder {
  /**
   * @ignore
   */
  async seed(): Promise<any> {
    const final: ServicioEntity[] = ServiciosToCreate.map((s) => {
      const ent = plainToClass(ServicioEntity, s);
      ent.precio2 = s.precio;
      ent.precio3 = s.precio;
      return ent;
    });

    const createdServicios = await getRepository(ServicioEntity).save(final);

    return {
      createdServicios,
    };
  }
  /**
   * @ignore
   */
  async drop(): Promise<any> {
    await getRepository(ServicioEntity).delete({});
    return true;
  }
}
