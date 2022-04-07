import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IncidenciaEntity } from './incidencias.entity';

@Entity('incidenciasEmpleados')
export class IncidenciaEmpleadoEntity extends CommonEntity {
  @ManyToOne(() => IncidenciaEntity, { nullable: false })
  incidencia: IncidenciaEntity;

  @ManyToOne(() => UsersEntity, { nullable: false })
  empleado: UsersEntity;

  @Column({
    type: 'float',
    nullable: false,
    default: 0,
  })
  montoDescuento: number; //el monto calculado final para esta incidencia en caso de ser UnidadesDescuento.VARIABLE

  @Column({ type: 'date', nullable: false })
  fecha: Date; //fecha de la incidencia

  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity; //quien aplico la incidencia

  @Column({ type: 'tinytext', nullable: true })
  observaciones: string;
}
