import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';

import { Response } from 'express';

import { HeimdalService } from './heimdal.service';
@Controller('heimdal')
export class HeimdalController {
  constructor(private readonly heimalService: HeimdalService) {}
  @Get('pruebas')
  @HttpCode(HttpStatus.CREATED)
  async pruebas(@Res() res: Response) {
    const data: any = {
      ventas: [
        { cliente: 'Erik Corona' },
        { cliente: 'Esteban Sanchez' },
        { cliente: 'Raymundo Gómez' },
      ],
    };
    const buffer = await this.heimalService.render('test/pruebas', data);
    const outputFileName = 'salida.docx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('pruebaspdf')
  @HttpCode(HttpStatus.CREATED)
  async pruebasPdf(@Res() res: Response) {
    const data: any = {
      ventas: [
        { cliente: 'Erik Corona' },
        { cliente: 'Esteban Sanchez' },
        { cliente: 'Raymundo Gómez' },
      ],
    };
    const buffer = await this.heimalService.render('test/pruebas', data, 'pdf');
    const outputFileName = 'salida.pdf';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('pruebasxls')
  @HttpCode(HttpStatus.CREATED)
  async pruebasXls(@Res() res: Response) {
    const buffer = await this.heimalService.reporteUno();
    const outputFileName = 'salida.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=' + outputFileName,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
