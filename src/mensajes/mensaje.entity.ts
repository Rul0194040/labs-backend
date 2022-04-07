import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('mensajes')
export class MensajeEntity extends CommonEntity {
  @ManyToOne(() => UsersEntity, { nullable: true })
  origen: UsersEntity;

  @ManyToOne(() => UsersEntity, { nullable: false })
  destino: UsersEntity;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'boolean', default: false })
  leido: boolean;
}
