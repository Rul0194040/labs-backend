import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('syslog')
export class SyslogEntity extends CommonEntity {
  //un insumo pertenece a un grupo de insumo
  @ManyToOne(() => UsersEntity, { nullable: true })
  user?: UsersEntity;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  method: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  baseUrl: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  statusCode: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  contentLength: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  userAgent: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  ip: string;
}
