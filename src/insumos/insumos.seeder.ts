import { Injectable } from '@nestjs/common';
import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import { plainToClass } from 'class-transformer';
import { Seeder } from 'nestjs-seeder';
import { getRepository } from 'typeorm';
import { InsumoEntity } from './insumo.entity';
import { InsumosToCreate } from './insumos.collection';

/**
 * @ignore
 */
@Injectable()
export class InsumosSeeder implements Seeder {
  /**
   * @ignore
   */
  async seed(): Promise<any> {
    for (const bloqueInsumos of InsumosToCreate) {
      const tipoIns = await getRepository(TipoInsumoEntity).findOne({
        id: bloqueInsumos.tipo,
      });
      if (tipoIns) {
        const insumosConTipo = plainToClass(
          InsumoEntity,
          bloqueInsumos.insumos.map((i) => {
            i.tipoInsumo = tipoIns;
            return i;
          }),
        );
        await getRepository(InsumoEntity).save(insumosConTipo);
      }
    }

    return;
  }
  /**
   * @ignore
   */
  async drop(): Promise<any> {
    await getRepository(InsumoEntity).delete({});
    return true;
  }
}
