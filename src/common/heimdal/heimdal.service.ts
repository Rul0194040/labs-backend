import { Injectable } from '@nestjs/common';
import { createReport } from 'docx-templates';
import { readFileSync } from 'fs';
import { buildExport } from 'node-excel-export';
import * as libre from 'libreoffice-convert';
@Injectable()
export class HeimdalService {
  /**
   * Renderizar una plantilla .docx con los
   * datos que se le proveen en <data>
   *
   * @param templateUri Ruta de la plantilla a renderizar relativo a /src/common/heimdal/templates
   * @param data Objeto de datos utilizados por la plantilla
   * @returns {Buffer} buffer de memoria con el resultado.
   */
  async render(
    templateUri: string,
    data: any,
    format: 'docx' | 'pdf' = 'docx',
  ): Promise<Uint8Array> {
    const fileRoute = 'src/common/heimdal/templates/';
    const template = readFileSync(fileRoute + templateUri + '.docx');
    const bufferDocx = await createReport({
      template,
      data,
    });
    if (format === 'docx') {
      return Buffer.from(bufferDocx);
    }
    const bufferPdf = await this.docxPdf(bufferDocx);
    return Buffer.from(bufferPdf);
  }

  async docxPdf(bufferDocx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      libre.convert(bufferDocx, '.pdf', undefined, (err, bufferPdf) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
          reject(err);
        }
        resolve(bufferPdf);
      });
    });
  }

  async reporteUno() {
    const styles = {
      header: {
        font: { color: { rgb: 'FF000000' }, sz: 12, bold: true },
        alignment: { horizontal: 'center' },
        height: 50,
      },

      header2: {
        font: { color: { rgb: 'FF000000' }, sz: 10, bold: true },
        alignment: { horizontal: 'center' },
      },
      cellHeader: {
        font: {
          color: { rgb: 'FF000000' },
          sz: 10,
          bold: true,
        },
        alignment: { horizontal: 'center' },
      },
      cell: { alignment: { horizontal: 'left' }, font: { sz: 10 } },
      cellCenter: {
        alignment: { horizontal: 'center' },
        font: { sz: 10 },
      },
      cellNumber: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
      },
      cellPorcentaje: {
        alignment: { horizontal: 'right' },
        font: { sz: 10 },
        numFmt: '0%',
      },
    };

    const heading = [
      [{ value: 'LABORATORIO SAN FRANCISCO', style: styles.header }],
      [{ value: 'REPORTE DE COMPRAS ', style: styles.header2 }],
      [''],
    ];

    const specification = {
      proveedorName: {
        displayName: 'Proveedor',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 200,
      },
      total: {
        displayName: 'Total',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellNumber,
        width: 100,
      },
      tipoComprobante: {
        displayName: 'Tipo Comprobante',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 200,
      },
      referencia: {
        displayName: 'Referencia',
        headerStyle: styles.cellHeader,
        cellStyle: styles.cellCenter,
        width: 250,
      },
    };

    const dataset = [
      {
        proveedorName: 'Proveedor1',
        total: 100,
        tipoComprobante: 'Nota',
        referencia: 'REF1',
      },
      {
        proveedorName: 'Proveedor2',
        total: 200,
        tipoComprobante: 'Nota',
        referencia: 'REF2',
      },
      {
        proveedorName: 'Proveedor2',
        total: 200,
        tipoComprobante: 'Nota',
        referencia: 'REF2',
      },
    ];

    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 1, column: 3 } },
      { start: { row: 2, column: 1 }, end: { row: 2, column: 3 } },
      { start: { row: 3, column: 1 }, end: { row: 3, column: 3 } },
    ];

    const report = buildExport([
      {
        name: 'Reporte Uno',
        heading: heading,
        merges: merges,
        specification: specification,
        data: dataset,
      },
    ]);

    return report;
  }
}
