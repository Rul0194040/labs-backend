import { TipoInsumoEntity } from '@sanfrancisco/catalogos/tipos-insumos/tipo-insumo.entity';
import { TipoUnidadEntity } from '@sanfrancisco/catalogos/tipos-unidades/tipos-unidades.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DescuentaEn } from './DescuentaEn.enum';

@Entity('insumos')
export class InsumoEntity extends CommonEntity {
  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  descripcion: string;

  @Column({
    name: 'codigo',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  codigo: string;

  @Column({
    name: 'clave',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  clave: string;

  //un insumo pertenece a un grupo de insumo
  @ManyToOne(() => TipoInsumoEntity)
  tipoInsumo?: TipoInsumoEntity;

  @Column({ type: 'int', nullable: true })
  tipoInsumoId?: number;

  @ManyToOne(() => TipoUnidadEntity)
  tipoUnidad?: TipoUnidadEntity;

  @Column({ type: 'int', nullable: true })
  tipoUnidadId?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: DescuentaEn.SUCURSAL,
  })
  descuentaEn: string;
}
