"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeimdalService = void 0;
const common_1 = require("@nestjs/common");
const docx_templates_1 = require("docx-templates");
const fs_1 = require("fs");
const node_excel_export_1 = require("node-excel-export");
const libre = require("libreoffice-convert");
let HeimdalService = class HeimdalService {
    async render(templateUri, data, format = 'docx') {
        const fileRoute = 'src/common/heimdal/templates/';
        const template = fs_1.readFileSync(fileRoute + templateUri + '.docx');
        const bufferDocx = await docx_templates_1.createReport({
            template,
            data,
        });
        if (format === 'docx') {
            return Buffer.from(bufferDocx);
        }
        const bufferPdf = await this.docxPdf(bufferDocx);
        return Buffer.from(bufferPdf);
    }
    async docxPdf(bufferDocx) {
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
        const report = node_excel_export_1.buildExport([
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
};
HeimdalService = __decorate([
    common_1.Injectable()
], HeimdalService);
exports.HeimdalService = HeimdalService;
//# sourceMappingURL=heimdal.service.js.map