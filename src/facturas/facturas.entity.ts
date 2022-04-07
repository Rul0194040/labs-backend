import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity, OneToOne } from 'typeorm';
import { VentaEntity } from '../ventas/ventas.entity';

@Entity('facturas')
export class FacturaEntity extends CommonEntity {
  @OneToOne(() => VentaEntity, { nullable: true })
  venta: VentaEntity;
  @Column({ type: 'int', nullable: true })
  ventaId: number;

  @Column({ type: 'tinytext' })
  contribuyente: string;

  @Column({ type: 'varchar', length: 1, default: 'F' })
  persona: string;

  @Column({ type: 'tinytext' })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  telefono: string;

  @Column({ type: 'tinytext' })
  rfc: string;

  @Column({ type: 'tinytext' })
  calle: string;

  @Column({ type: 'tinytext' })
  numInt: string;

  @Column({ type: 'tinytext', default: null })
  numExt: string;

  @Column({ type: 'tinytext', default: null })
  colonia: string;

  @Column({ type: 'tinytext' })
  cp: string;

  @Column({ type: 'tinytext' })
  estado: string;

  @Column({ type: 'tinytext' })
  municipio: string;

  @Column({ type: 'tinytext' })
  pais: string;

  //Rutas de archivos finales
  @Column({ type: 'tinytext' })
  xml: string;

  @Column({ type: 'tinytext' })
  pdf: string;

  //cuando el cliente descarga, actualizamos...
  @Column({ type: 'boolean', default: false })
  descargado: boolean;

  @Column({ type: 'datetime', default: null })
  fechaDescargado: Date;

  @Column({ type: 'varchar', length: 15 })
  ipDescargado: string;
}
