import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('notificaciones')
export class NotificacionEntity extends CommonEntity {
  @Column({
    type: 'tinytext',
    nullable: false,
  }) //             Sucurusal       || Administrador de matriz
  titulo: string; //Alerta de minimo || (en sucursal X)

  @Column({
    type: 'text',
  }) //                  sucursal                       || Administrador de matriz
  descripcion: string; //Insumo X ha llegado al límite || (en la sucursal X)

  @ManyToOne(() => UsersEntity, { nullable: true }) //no lleva para notificaciones de sistema
  de?: UsersEntity; //si no tiene, es de sistema.

  @Column({ type: 'int', nullable: true })
  deId?: number;

  @ManyToOne(() => UsersEntity, { nullable: false }) //user admin de sucursal || user admin de matriz
  para: UsersEntity;

  @Column({ type: 'int', nullable: false })
  paraId?: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  leido: boolean;

  @Column({
    type: 'tinytext',
  })
  link: string; // /#/insumos/<id>
}
