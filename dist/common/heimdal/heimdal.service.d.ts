/// <reference types="node" />
export declare class HeimdalService {
    render(templateUri: string, data: any, format?: 'docx' | 'pdf'): Promise<Uint8Array>;
    docxPdf(bufferDocx: any): Promise<Buffer>;
    reporteUno(): Promise<any>;
}
