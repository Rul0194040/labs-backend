import { ImagesService } from './../../images/images.service';
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '@sanfrancisco/auth/guards/jwt/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { FileResultDTO } from '@sanfrancisco/common/DTO/fileResult.dto';
import { ImageTypes } from '@sanfrancisco/images/imageTypes.enum';
import { SaveImageDTO } from '@sanfrancisco/images/model/saveImage.dto';
import { ImageEntity } from '@sanfrancisco/images/model/image.entity';

@Controller('avatar')
@UseGuards(JwtAuthGuard)
export class AvatarController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imagesService: ImagesService,
  ) {}

  /**
   * Agregar imagen a un usuario
   *
   * @param avatar el archivo
   */
  @ApiOperation({
    summary: 'Agregar imagen del usuario.',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 1024 * 1024 * 3, //tamaño de archivo hasta 3MB
      },
      fileFilter: async (req, file, cb) => {
        if (
          !(
            (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') &&
            (file.originalname.split('.').reverse()[0] === 'jpg' ||
              file.originalname.split('.').reverse()[0] === 'jpeg')
          )
        ) {
          return cb(
            new HttpException(
              'Tipo de archivo no aceptado, se aceptan solamente "image/jpg".',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        return cb(null, true);
      },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const dirPath = `./uploads/${ImageTypes.avatar}/`;
          if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
          }
          cb(null, dirPath);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: FileResultDTO,
    @Req() req,
  ): Promise<ImageEntity> {
    const data: SaveImageDTO = {
      parent: req['user'].id,
      type: ImageTypes.avatar,
    };

    const imagenSubida = await this.imagesService.save(file, data);
    //poner la imagen en el bucket

    try {
      const imageFile = imagenSubida.uuid + '.jpg';
      const imagePath = imagenSubida.destination + imageFile;
      await this.usersService.updateUserPicture(data.parent, `${imagePath}`);
    } catch (error) {
      console.log(error);
    }

    return imagenSubida;
  }
}
