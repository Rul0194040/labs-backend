import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DetalleVentasEntity } from '../ventasDetalle.entity';

@Entity('muestras')
export class MuestraEntity extends CommonEntity {
  @ManyToOne(() => DetalleVentasEntity, { nullable: false })
  ventaDetalle: DetalleVentasEntity;

  @Column({ type: 'int', nullable: false })
  ventaDetalleId: number;

  //usuario que registra la muestra.
  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity;

  @Column({ type: 'int', nullable: false })
  usuarioId: number;

  @Column({ type: 'text', nullable: true })
  notas: string;
}
