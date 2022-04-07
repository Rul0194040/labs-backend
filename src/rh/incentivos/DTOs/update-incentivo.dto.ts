import { PartialType } from '@nestjs/swagger';
import { CreateIncentivoDTO } from './create-incentivo.dto';

export class UpdateIncentivosDTO extends PartialType(CreateIncentivoDTO) {}
