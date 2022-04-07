import { CreateIncidenciaDTO } from './create-incidencia.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateIncidenciasDTO extends PartialType(CreateIncidenciaDTO) {}
