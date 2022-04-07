import { ApiProperty } from '@nestjs/swagger';
import { GrupoServicioEntity } from '../../catalogos/grupos-servicios/grupo-servicio.entity';
import { TipoMuestraEntity } from '../../catalogos/tipos-muestras/tipos-muestras.entity';
import { TipoUnidadEntity } from '../../catalogos/tipos-unidades/tipos-unidades.entity';

export class UpdateServiceCatalogsDTO {
  @ApiProperty({
    description: 'Grupo de servicio al que pertenece',
  })
  grupoServicio?: number;

  @ApiProperty({
    description: 'Tipo de muestra al que pertenece',
  })
  tipoMuestra?: number;

  @ApiProperty({
    description: 'Tipo de unidad',
  })
  tipoUnidad?: number;
}

export class UpdateServiceCatalogsEntityDTO {
  @ApiProperty({
    description: 'Grupo de servicio al que pertenece',
  })
  grupoServicio?: GrupoServicioEntity;

  @ApiProperty({
    description: 'Tipo de muestra al que pertenece',
  })
  tipoMuestra?: TipoMuestraEntity;

  @ApiProperty({
    description: 'Tipo de unidad',
  })
  tipoUnidad?: TipoUnidadEntity;
}
