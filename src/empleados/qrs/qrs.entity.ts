import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('qrs')
export class QrsEntity extends CommonEntity {
  //relacion a si mismo, solo para los codigos de salida, este lleva que codigo fue
  //el de entrada, el cual, proviene del localstorage del empleado
  @ManyToOne(() => QrsEntity, { nullable: true })
  entrada: QrsEntity;
  @Column({ type: 'int', nullable: true })
  entradaId: number;

  //un codigo pertenece a una sucursal siempre.
  @ManyToOne(() => SucursalEntity, { nullable: false })
  sucursal: SucursalEntity;
  @Column({ type: 'int', nullable: false })
  sucursalId: number;

  //y va a ser usado (en algun momento) por un empleado
  //(si ya tiene empleado) ya fue usado
  @ManyToOne(() => UsersEntity, { nullable: true })
  empleado: UsersEntity;
  @Column({ type: 'int', nullable: true })
  empleadoId: number;

  //hora a la que fue usado este token
  @Column({ type: 'timestamp', nullable: true, default: null })
  fechaHora: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  lat: string;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  lng: string;
}
