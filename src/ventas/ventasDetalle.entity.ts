import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { ServicioEntity } from '@sanfrancisco/servicios/servicio.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { VentaEntity } from './ventas.entity';

@Entity('detalleVentas')
export class DetalleVentasEntity extends CommonEntity {
  @ManyToOne(() => VentaEntity)
  venta: VentaEntity;

  @Column({ type: 'int', nullable: true })
  ventaId: number;

  @ManyToOne(() => ServicioEntity, { nullable: true })
  servicio: ServicioEntity;

  @Column({ type: 'int', nullable: true })
  servicioId: number;

  @Column({
    type: 'float',
    default: 0,
    nullable: true,
  })
  descuento: number;

  @Column({
    type: 'float',
    default: 0,
    nullable: true,
  })
  precio: number;

  @Column({ type: 'boolean', default: false })
  cerrado: boolean;

  @Column({ type: 'boolean', default: false })
  estudios: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  medico: string;

  @Column({ type: 'text', nullable: true })
  recomendaciones: string;
}
