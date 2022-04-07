import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { StripeCustomerDTO } from './dtos/stripeCustomer.dto';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { ApiTags } from '@nestjs/swagger';
import { getRepository, UpdateResult } from 'typeorm';
import { ClienteEntity } from '@sanfrancisco/clientes/clientes.entity';
import { ClientesService } from '@sanfrancisco/clientes/clientes.service';
import { StripeChargeDTO } from './dtos/stripeCharge.dto';
@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly clientesService: ClientesService,
  ) {}

  /**
   * Crear un cliente en stripe, con la base de un cliente de labs
   *
   * @metod POST
   * @param {number} id Id del cliente de labs
   * @returns {Stripe.Response<Stripe.Customer>} Cliente de Stripe
   */
  @Post('customers')
  async createCustomer(
    @Body('customerId', ParseIntPipe) customerId: number,
  ): Promise<UpdateResult> {
    //vamos por el cliente de labs.
    const clienteLabs = await getRepository(ClienteEntity).findOne(customerId);

    //existe?
    if (!clienteLabs) {
      throw new HttpException(
        'El cliente no existe en labs.',
        HttpStatus.NOT_FOUND,
      );
    }

    //estructura del cliente
    const customerToCreate: StripeCustomerDTO = {
      name: clienteLabs.nombre,
      email: clienteLabs.email,
      phone: clienteLabs.telefono,
      metadata: {
        labsId: clienteLabs.id,
      },
    };

    //creamos el cliente en stripe
    const stripeCustomer = await this.stripeService.createCustomer(
      customerToCreate,
    );

    //actualizamos el registro del cliente con su id de stripe
    return this.clientesService.updateStripeId(
      clienteLabs.id,
      stripeCustomer.id,
    );
  }

  /**
   * Obtener un cliente de stripe
   *
   * @param {string} stripeId id de stripe del cliente a obtener
   * * Retorna un cliente de stripe
   * @returns {Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>}
   */
  @Get('customers/:stripeId')
  async getCustomer(
    @Param('stripeId') stripeId: string,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return this.stripeService.getCustomer(stripeId);
  }

  /**
   * Listado de clientes de stripe
   *
   * @returns Listado
   */
  @Get('customers')
  async getCustomers(): Promise<Stripe.ApiListPromise<Stripe.Customer>> {
    return this.stripeService.getCustomers();
  }

  @Put('customers/:stripeId/charge')
  async createCharge(
    @Param('stripeId') stripeId: string,
    @Body() charge: StripeChargeDTO,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    return this.stripeService.createCharge(stripeId, charge);
  }
}
