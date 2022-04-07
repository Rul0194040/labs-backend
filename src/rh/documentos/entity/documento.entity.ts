import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Column, Entity } from 'typeorm';

@Entity('documentos')
export class DocumentoEntity extends CommonEntity {
  @Column({
    type: 'tinytext', //255
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'tinytext', //255
    nullable: false,
  })
  fileName: string; //nombre final que tomara el archivo
}
