import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentoEntity } from './documento.entity';

@Entity('documentosEmpleados')
export class DocumentoEmpleadoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentoEntity, { nullable: false })
  documento: DocumentoEntity;

  @ManyToOne(() => UsersEntity, { nullable: false })
  empleado: UsersEntity;

  @Column({ type: 'tinytext' })
  file: string;
}
