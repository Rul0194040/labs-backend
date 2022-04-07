import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { getRepository } from 'typeorm';
import { GrupoServicioEntity } from './grupos-servicios/grupo-servicio.entity';
import { GruposServiciosToCreate } from './grupos-servicios/grupos-servicios.collection';
import { TipoInsumoEntity } from './tipos-insumos/tipo-insumo.entity';
import { TiposInsumosToCreate } from './tipos-insumos/tipos-insumos.collection';
import { TiposMuestrasToCreate } from './tipos-muestras/tipos-muestras.collection';
import { TipoMuestraEntity } from './tipos-muestras/tipos-muestras.entity';
import { TiposUnidadesToCreate } from './tipos-unidades/tipos-unidades.collection';
import { TipoUnidadEntity } from './tipos-unidades/tipos-unidades.entity';

/**
 * @ignore
 */
@Injectable()
export class CatalogsSeeder implements Seeder {
  /**
   * @ignore
   */
  async seed(): Promise<any> {
    const createdGruposServicios = await getRepository(
      GrupoServicioEntity,
    ).save(GruposServiciosToCreate);

    const createdTipoInsumoEntity = await getRepository(TipoInsumoEntity).save(
      TiposInsumosToCreate,
    );

    const createdTiposMuestras = await getRepository(TipoMuestraEntity).save(
      TiposMuestrasToCreate,
    );

    const createdTiposUnidades = await getRepository(TipoUnidadEntity).save(
      TiposUnidadesToCreate,
    );

    return {
      createdGruposServicios,
      createdTipoInsumoEntity,
      createdTiposMuestras,
      createdTiposUnidades,
    };
  }
  /**
   * @ignore
   */
  async drop(): Promise<any> {
    await getRepository(GrupoServicioEntity).delete({});
    await getRepository(TipoInsumoEntity).delete({});
    await getRepository(TipoMuestraEntity).delete({});
    await getRepository(TipoUnidadEntity).delete({});
    return true;
  }
}
