import { CajaEntity } from '@sanfrancisco/cajas/cajas.entity';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/commonEntity.abstract';
import { EstatusCorte } from './estatusCorte.enum';

@Entity('cortesTesorero')
export class CorteTesoreroEntity extends CommonEntity {
  @OneToMany(() => CajaEntity, (c) => c.corteTesorero)
  cajas: CajaEntity;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  estatus: EstatusCorte;

  @ManyToOne(() => UsersEntity, { nullable: true })
  tesorero: UsersEntity;

  @Column({ type: 'int', nullable: true })
  tesoreroId: number;
}
