import { CreateMovBancarioDTO } from './create-mov-bancario.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdateMovbancario extends PartialType(CreateMovBancarioDTO) {}
