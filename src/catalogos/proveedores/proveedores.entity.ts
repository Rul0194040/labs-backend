import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';
@Entity('proveedores')
export class ProveedorEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 13,
  })
  rfc: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: '',
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: '',
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 350,
    nullable: true,
  })
  direccion: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  contacto: string;
}
