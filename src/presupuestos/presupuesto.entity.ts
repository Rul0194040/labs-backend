import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EstatusPresupuesto } from './EstatusPresupuesto.enum';
import { PresupuestoDetalleEntity } from './presupuestosDetalle.entity';

@Entity('presupuestos')
export class PresupuestoEntity extends CommonEntity {
  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity;
  @Column({ type: 'int', nullable: false })
  usuarioId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  fecha: Date;

  @Column({
    type: 'varchar',
    length: 1,
    nullable: false,
    default: EstatusPresupuesto.BORRADOR, //Borrador, Generado
  })
  estatus: EstatusPresupuesto;

  @OneToMany(
    () => PresupuestoDetalleEntity,
    (presupuestoDetalle) => presupuestoDetalle.presupuesto,
  )
  presupuestoDetalle: PresupuestoDetalleEntity;
}
