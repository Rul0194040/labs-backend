import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '@sanfrancisco/auth/guards/apikey/apikey.guard';
import { MyLogger } from '@sanfrancisco/logger';
import { VentaEntity } from '@sanfrancisco/ventas/ventas.entity';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { getRepository } from 'typeorm';
import { PxlabService } from './pxlab.service';

@ApiTags('pxlab')
@Controller('pxlab')
@UseGuards(ApiKeyGuard)
export class PxlabController {
  private logger = new MyLogger(PxlabController.name);
  constructor(
    private readonly pxService: PxlabService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Subir archivo resultado del paciente
   *
   * que entra por aqui.
   * @param folioPxLab el archivo a usar
   */
  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 1024 * 1024 * 3, //tamaño de archivo hasta 3MB //TODO: deberia venir de config
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (
          allowedTypes.indexOf(file.mimetype) > -1 &&
          file.originalname.split('.').reverse()[0] === 'PDF'
        ) {
          return cb(null, true);
        }
        return cb(
          new Error(
            'Tipo de archivo no aceptado, se aceptan solamente "application/pdf".',
          ),
          false,
        );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dirPath = './uploads/pxlab'; //TODO: deberia venir de config
          if (!existsSync(`${dirPath}`)) {
            mkdirSync(`${dirPath}`, { recursive: true });
          }
          cb(null, dirPath);
        },
        filename: (req, file, cb) => {
          const fileNameDest = file.originalname;
          cb(null, fileNameDest);
        },
      }),
    }),
  )
  async uploadEstudio(@UploadedFile() file): Promise<any> {
    //file.filename  "1234569.pdf";
    //emitir el evento para actualizar la venta(estudioPx=true) ventasService.estudioPxVenta
    //this.eventEmitter.emit('pxlab.pdf', file.filename.split('.')[0]);
    const folioPx = file.filename.split('.')[0];
    this.logger.verbose('Recibido pdf pxlab: ' + folioPx);
    return getRepository(VentaEntity)
      .createQueryBuilder()
      .update()
      .set({ estudioPx: true })
      .where('folioPxLab=:folio', { folio: folioPx })
      .execute();

    return file;
  }
}
