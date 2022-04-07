import { Entity, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { ZonaEnum } from './zona.enum';
import { ApiKeyEntity } from './api-keys.entity';

/**
 * @ignore
 */
@Entity('sucursales')
export class SucursalEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  calle: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  numExt: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  colonia: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  cp: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  municipio: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  esMatriz: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  esLaboratorio: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  esForanea: boolean;

  @Column({
    type: 'float',
    nullable: true,
  })
  lat: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  lng: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  responsable: string;

  @OneToOne(() => UsersEntity, { nullable: true })
  @JoinColumn()
  userResponsable: UsersEntity;

  @Column({
    type: 'boolean',
    default: false,
  })
  puedeHacerRequisicion: boolean;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  zona: ZonaEnum;

  @OneToMany(() => ApiKeyEntity, (key) => key.sucursal)
  apikeys: ApiKeyEntity[];

  @Column({
    type: 'boolean',
    default: false,
  })
  seleccionarZona: boolean;

  @OneToMany(() => UsersEntity, (user) => user.sucursal)
  usuarios: UsersEntity;
}
