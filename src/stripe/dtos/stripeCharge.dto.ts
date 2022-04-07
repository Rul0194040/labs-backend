import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class StripeChargeDTO {
  @ApiProperty()
  @Min(10)
  @Max(999999.99)
  amount: number;

  @ApiProperty()
  @IsIn(['usd', 'mxn'])
  currency: string; //mxn
  /**
   * source (optional), si no se especifica intenta cobrar con la default,
   * si no tiene tarjeta default, regresa un error desde stripe
   *
   * A payment source to be charged. This can be the ID of a card
   * (i.e., credit or debit card), a bank account, a source, a token,
   * or a connected account. For certain sources—namely, cards, bank
   * accounts, and attached sources—you must also pass the ID of the
   * associated customer.
   */
  @ApiProperty()
  @IsOptional()
  source?: string; //token tarjeta

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  metadata?: any; //el id de la venta?
}
