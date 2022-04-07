import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IncentivoEntity } from './incentivos.entity';

@Entity('incentivosEmpleados')
export class IncentivoEmpleadoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IncentivoEntity, { nullable: false })
  incentivo: IncentivoEntity;

  @ManyToOne(() => UsersEntity, { nullable: false })
  empleado: UsersEntity;

  @Column({ type: 'date', nullable: false })
  fecha: Date; //fecha de la incidencia

  @Column({ type: 'float', nullable: false })
  montoIncentivo: number; //monto en pesos calculado del incentivo

  @ManyToOne(() => UsersEntity, { nullable: false })
  usuario: UsersEntity; //quien aplico el incentivo

  @Column({ type: 'tinytext', nullable: true })
  observaciones: string;
}
