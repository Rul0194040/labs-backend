import { ApiProperty } from '@nestjs/swagger';
/**
 * @ignore
 */
export class statusUserDTO {
  @ApiProperty()
  active: boolean;

  constructor(active: boolean) {
    this.active = active;
  }
}
