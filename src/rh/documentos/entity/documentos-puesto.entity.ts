import { PuestoEntity } from '@sanfrancisco/rh/puestos-departamentos/entity/puesto.entity';
import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentoEntity } from './documento.entity';

@Entity('documentosPuestos')
@Index('documento', ['documento', 'puesto'], { unique: true })
export class DocumentoPuestoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentoEntity)
  documento: DocumentoEntity;

  @ManyToOne(() => PuestoEntity)
  puesto: PuestoEntity;
}
