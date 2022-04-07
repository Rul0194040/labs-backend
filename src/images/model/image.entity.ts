import { UsersEntity } from '@sanfrancisco/users/users.entity';
import { CommonEntity } from '@sanfrancisco/common/commonEntity.abstract';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

/**
 * @ignore
 */
@Entity('images')
export class ImageEntity extends CommonEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  title: string;
  @Column({
    name: 'description',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  description: string;
  @Column({
    name: 'fieldname',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  fieldname: string;
  @Column({
    name: 'originalname',
    type: 'varchar',
    length: 150,
  })
  originalname: string;
  @Column({
    name: 'encoding',
    type: 'varchar',
    length: 150,
  })
  encoding: string;
  @Column({
    name: 'mimetype',
    type: 'varchar',
    length: 150,
  })
  mimetype: string;
  @Column({
    name: 'destination',
    type: 'varchar',
    length: 150,
  })
  destination: string;
  @Column({
    name: 'filename',
    type: 'varchar',
    length: 150,
  })
  filename: string;
  @Column({
    name: 'path',
    type: 'text',
  })
  path: string;
  @Column({
    name: 'size',
    type: 'int',
    nullable: false,
  })
  size: number;

  @OneToOne(() => UsersEntity, (avatar) => avatar.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  avatar?: UsersEntity;

  @Column({
    type: 'int',
    nullable: true,
  })
  avatarId: number;

  constructor(
    id: number,
    uuid: string,
    title: string,
    description: string,
    destination: string,
    encoding: string,
    fieldname: string,
    filename: string,
    mimetype: string,
    originalname: string,
    path: string,
    size: number,
    active?: boolean,
    avatar?: UsersEntity,
  ) {
    super();
    this.id = id;
    this.uuid = uuid;
    this.title = title;
    this.description = description;
    this.destination = destination;
    this.encoding = encoding;
    this.fieldname = fieldname;
    this.filename = filename;
    this.mimetype = mimetype;
    this.originalname = originalname;
    this.path = path;
    this.size = size;
    this.active = active;
    this.avatar = avatar;
  }
}
