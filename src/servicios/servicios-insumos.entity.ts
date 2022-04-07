import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { InsumoEntity } from '@sanfrancisco/insumos/insumo.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { ServicioEntity } from './servicio.entity';

@Entity('serviciosInsumos')
@Index(['servicio', 'insumo'], { unique: true })
export class ServiciosInsumosEntity extends CommonEntity {
  @ManyToOne(() => ServicioEntity, { nullable: false })
  servicio: ServicioEntity;

  @ManyToOne(() => InsumoEntity, { nullable: false })
  insumo: InsumoEntity;

  /**
   * Cantidad a descontar del inventario por cada venta
   */
  @Column({ type: 'float', nullable: false })
  cantidad: number;
}
