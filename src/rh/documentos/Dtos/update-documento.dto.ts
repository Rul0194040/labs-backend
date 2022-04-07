import { CreateDocumentoDto } from './create-documento.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateDocumentoDto extends PartialType(CreateDocumentoDto) {}
