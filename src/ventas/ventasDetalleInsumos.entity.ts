import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { DetalleVentasEntity } from './ventasDetalle.entity';
import { SucursalesInsumosEntity } from '@sanfrancisco/sucursales/sucursalesInsumos.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';

@Entity('detalleVentasInsumos')
@Index(['detalleVenta', 'insumoSucursal'], { unique: true })
export class DetalleVentasInsumosEntity extends CommonEntity {
  @ManyToOne(() => DetalleVentasEntity, { nullable: false })
  detalleVenta: DetalleVentasEntity;
  @Column({ type: 'int', nullable: false })
  detalleVentaId: number;

  @ManyToOne(() => SucursalesInsumosEntity, { nullable: false })
  insumoSucursal: SucursalesInsumosEntity;
  @Column({ type: 'int', nullable: false })
  insumoSucursalId: number;

  @ManyToOne(() => UsersEntity)
  usuario: UsersEntity;
  @Column({ type: 'int', nullable: false })
  usuarioId: number;

  @ManyToOne(() => TipoUnidadEntity)
  unidad: TipoUnidadEntity;
  @Column({ type: 'int', nullable: false })
  unidadId: number;

  @Column({ type: 'float', default: 0 })
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  nota: string;
}
