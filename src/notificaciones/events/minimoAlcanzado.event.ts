import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';

export class MinimoAlcanzadoEvent {
  sucursal: SucursalEntity;
  insumo: InsumoEntity;
  constructor(sucursal: SucursalEntity, insumo: InsumoEntity) {
    this.sucursal = sucursal;
    this.insumo = insumo;
  }
}
