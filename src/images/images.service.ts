import { UsersEntity } from './../users/users.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FileResultDTO } from '@sanfrancisco/common/DTO/fileResult.dto';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { getRepository } from 'typeorm';
import { ImageTypes } from './imageTypes.enum';
import { ImageEntity } from './model/image.entity';
import { SaveImageDTO } from './model/saveImage.dto';

/**
 * Service para usuarios
 */
@Injectable()
export class ImagesService {
  /**
   * Retorna un stream de la imagen solicitada
   *
   * @param uuid uuid de la imagen
   */
  async get(uuid): Promise<string | boolean> {
    //const filesRoute = './';

    const image = await getRepository(ImageEntity).findOne({
      where: { uuid: uuid },
    });

    const imageRoute = image.destination + image.uuid + '.jpg';

    if (fs.existsSync(imageRoute)) {
      return imageRoute || false;
    }
  }
  /**
   * Borrar imagen
   *
   * @param id id de la imagen a borrar
   */
  async delete(
    uuid: string, //uuid de la imagen
  ): Promise<ImageEntity> {
    //consultar imagen
    const imageToDelete = await getRepository(ImageEntity).findOne({
      where: { uuid },
    });

    if (!imageToDelete) {
      throw new HttpException('No existe esa imagen', HttpStatus.NOT_FOUND);
    }

    //borrar de la base de datos
    const deleteResult = getRepository(ImageEntity).delete({ uuid: uuid });

    //borrar archivo
    if ((await deleteResult).affected === 1) {
      //estamos parados en src/modules/images
      const file = `${__dirname}/../../../${imageToDelete.path}`;

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }

    return imageToDelete;
  }

  /**
   * Crea una imagen en la base de datos con la informacion recibidas
   *
   * @param { FileResultDTO } file datos del archivo
   * @param { SaveImageDTO } data datos de la imagen
   * @returns { ImageEntity } imagen creada
   */
  async save(file: FileResultDTO, data: SaveImageDTO): Promise<ImageEntity> {
    let usuario: UsersEntity;
    //obtener el parent y determinar tamaño segun
    let minWidth = 800;
    let minHeight = 800;

    switch (data.type) {
      case ImageTypes.avatar:
        usuario = await getRepository(UsersEntity).findOne(data.parent);
        minWidth = 800;
        minHeight = 800;
        break;

      default:
        break;
    }

    // verificar si la imagen es del tamaño deseado (directo con sharp)
    const image = await sharp(file.path).metadata();
    if (image.width < minWidth || image.height < minHeight) {
      fs.unlinkSync(file.path);
      throw new HttpException(
        `La imagen no cumple los requerimientos de tamaño, (${minWidth}x${minHeight})`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //checar si ya existe la imagen para este usuario
    const imagenExiste = await getRepository(ImageEntity).findOne({
      where: { avatarId: usuario.id },
    });
    //si no existe crearla
    if (!imagenExiste) {
      const newImage: ImageEntity = new ImageEntity(
        undefined,
        undefined,
        data.title,
        data.description,
        file.destination,
        file.encoding,
        file.fieldname,
        file.filename,
        file.mimetype,
        file.originalname,
        file.path,
        file.size,
        true,
        usuario,
      );

      const createdImage = await getRepository(ImageEntity).save(newImage);
      //guardar el archivo final despues del resize, con el uuid de la imagen
      const finalFilename = usuario.uuid + '.jpg';

      await sharp(file.path)
        .resize({
          width: minWidth,
          height: minHeight,
          fit: sharp.fit.cover,
          position: 'centre',
        })
        .toFile(file.destination + finalFilename);

      //eliminar el original subido
      fs.unlinkSync(file.path);

      return createdImage;
    } else {
      const finalFilename = usuario.uuid + '.jpg';
      await sharp(file.path)
        .resize({
          width: minWidth,
          height: minHeight,
          fit: sharp.fit.cover,
          position: 'centre',
        })
        .toFile(file.destination + finalFilename);

      //eliminar el original subido
      fs.unlinkSync(file.path);
      return imagenExiste;
    }
  }
}
