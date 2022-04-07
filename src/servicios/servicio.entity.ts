import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { GrupoServicioEntity } from '@sanfrancisco/catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoMuestraEntity } from '@sanfrancisco/catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';

/**
 * @ignore
 */
@Entity('servicios')
export class ServicioEntity extends CommonEntity {
  /**
   * Numero de muestras tomadas para este servicio
   */
  @Column({
    type: 'int',
    default: 1,
    nullable: false,
  })
  muestrasRequeridas: number;

  @Column({
    name: 'clave',
    type: 'varchar',
    unique: true,
    length: 50,
    nullable: false,
  })
  clave: string;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'sinonimo1',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  sinonimo1: string;

  @Column({
    name: 'sinonimo2',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  sinonimo2: string;

  @Column({
    name: 'tiempo',
    type: 'float',
    nullable: true,
  })
  tiempo: number;

  @Column({
    name: 'precio',
    type: 'float',
    scale: 2,
    precision: 12,
    nullable: false,
  })
  precio: number;

  @Column({
    type: 'float',
    scale: 2,
    precision: 12,
    default: 0,
  })
  precio2: number;

  @Column({
    type: 'float',
    scale: 2,
    precision: 12,
    default: 0,
  })
  precio3: number;

  @Column({
    name: 'maquila',
    type: 'float',
    nullable: false,
    default: 0,
  })
  precioMaquila: number;

  @Column({
    name: 'factor',
    type: 'float',
    nullable: true,
  })
  factor: number;

  @Column({
    name: 'recomendaciones',
    type: 'text',
    nullable: true,
  })
  recomendaciones?: string;

  @Column({
    name: 'realizaEstudioEn',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'SUCURSAL',
  })
  realizaEstudioEn?: string; // en donde se realiza el estudio : SUCURSAL O LABORATORIO

  //un insumo pertenece a un grupo de insumo
  @ManyToOne(() => GrupoServicioEntity)
  grupoServicio?: GrupoServicioEntity;

  @Column({ type: 'int', nullable: true })
  grupoServicioId?: number;

  //un insumo puede pertenecer a un tipo de muestra
  @ManyToOne(() => TipoMuestraEntity)
  tipoMuestra?: TipoMuestraEntity;

  @Column({ type: 'int', nullable: true })
  tipoMuestraId?: number;

  //un insumo puede pertenecer a un tipo de unidad
  @ManyToOne(() => TipoUnidadEntity)
  tipoUnidad?: TipoUnidadEntity;

  @Column({ type: 'int', nullable: true })
  tipoUnidadId?: number;
}
