import { CreateEmpleadoDTO } from './create-empleado.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdateEmpleadoDTO extends PartialType(CreateEmpleadoDTO) {}
