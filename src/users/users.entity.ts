import { PuestoEntity } from './../rh/puestos-departamentos/entity/puesto.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { ImageEntity } from '@sanfrancisco/images/model/image.entity';
import { SucursalEntity } from '@sanfrancisco/sucursales/sucursal.entity';
import { Entity, Column, ManyToOne, OneToOne, ManyToMany } from 'typeorm';
import { PerfilTipoEmpleado, ProfileTypes } from './profiles.enum';

@Entity('users')
export class UsersEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  passwordToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  passwordTokenDate: Date;

  @Column({
    unique: true,
    type: 'varchar',
    name: 'email',
    length: 150,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    select: false, //.addSelect("user.password") para traer el campo cuando sea necesario
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: ProfileTypes.SYSADMIN,
  })
  profile: ProfileTypes;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: PerfilTipoEmpleado.GENERAL,
  })
  tipoEmpleado: PerfilTipoEmpleado;

  @Column({
    type: 'boolean',
    default: false,
  })
  validEmail?: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  accesoSistema?: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  emailToken?: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  rules?: string[];

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  picUrl?: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  telefono: string;

  @ManyToOne(() => SucursalEntity, { nullable: true })
  sucursal: SucursalEntity;

  @ManyToMany(() => SucursalEntity, { nullable: true })
  sucursalesPermitidas: SucursalEntity[];

  @OneToOne(() => ImageEntity, (image) => image.avatar)
  image: ImageEntity;

  @OneToOne(() => PuestoEntity, () => PuestoEntity)
  puesto: PuestoEntity;

  @Column({ type: 'json', default: null })
  device: any;

  @Column({ type: 'text', default: null })
  jwt: string;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  nip?: string;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  tipoSanguineo?: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  maxDescuento?: number;

  @Column({ type: 'date', nullable: true, default: null })
  fechaNac: Date;

  @Column({
    type: 'varchar',
    length: 18,
    nullable: true,
  })
  curp: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  grabandoRules: boolean;

  @Column({
    type: 'float',
    nullable: true,
  })
  comisionVendedor?: number;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    profile: ProfileTypes,
    password: string,
    rules: string[],
    active?: boolean,
    nip?: string,
    maxDescuento?: number,
  ) {
    super();
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profile = profile;
    this.password = password;
    this.active = active;
    this.rules = rules;
    this.nip = nip;
    this.maxDescuento = maxDescuento;
  }
}
