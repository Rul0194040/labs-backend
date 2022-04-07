import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MyLogger } from '@sanfrancisco/logger';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { StripeChargeDTO } from './dtos/stripeCharge.dto';
import { StripeCustomerDTO } from './dtos/stripeCustomer.dto';

@Injectable()
export class StripeService {
  public constructor(@InjectStripe() private readonly stripeClient: Stripe) {}
  private readonly logger = new MyLogger(StripeService.name);

  /**
   * Crear un cliente en stripe.
   *
   * @param {StripeCustomerDTO} customerToCreate Datos del cliente a crear
   * {
        "name": "Juan Pérez",
        "phone": "9511231234",
        "description": "Cliente de pruebas",
        "email": "juanperez@dominio.com",
        "address": {
          "line1": "Calle Principal",
          "line2": "100",
          "postal_code": "68000",
          "city": "Oaxaca de Juárez",
          "state": "Oaxaca",
          "country": "México"
        },
        "metadata": {
            "labsId": 1
        }
      }
   * @returns {Stripe.Response<Stripe.Customer>} Cliente de Stripe
   * {
      "id": "cus_JWHN3Lv8DUQjfR",
      "object": "customer",
      "address": {
          "city": "Oaxaca de Juárez",
          "country": "México",
          "line1": "Calle Principal",
          "line2": "100",
          "postal_code": "68000",
          "state": "Oaxaca"
      },
      "balance": 0,
      "created": 1621528445,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": "Cliente de pruebas",
      "discount": null,
      "email": "juanperez@dominio.com",
      "invoice_prefix": "B467BB5D",
      "invoice_settings": {
          "custom_fields": null,
          "default_payment_method": null,
          "footer": null
      },
      "livemode": false,
      "metadata": {
          "labsId": "1"
      },
      "name": "Juan Pérez",
      "next_invoice_sequence": 1,
      "phone": "9511231234",
      "preferred_locales": [],
      "shipping": null,
      "tax_exempt": "none"
    }
   * 
   * 
   * 
   */
  async createCustomer(
    customerToCreate: StripeCustomerDTO,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    //primero verificamos que el cliente no existe en stripe

    const existingCustomer = await this.stripeClient.customers.list({
      email: customerToCreate.email,
      limit: 1,
    });

    if (existingCustomer.data.length) {
      this.logger.verbose('createCustomer->Customer already exists:');
      this.logger.verbose(JSON.stringify(existingCustomer.data[0]));
      throw new HttpException(
        'El cliente ya existe en stripe.',
        HttpStatus.CONFLICT,
      );
    }

    const createdCustomer = await this.stripeClient.customers.create(
      customerToCreate,
    );
    this.logger.verbose('Customer created:');
    this.logger.verbose(JSON.stringify(createdCustomer));
    return createdCustomer;
  }

  /**
   * Obtener un cliente de stripe
   *
   * @param {string} stripeId id de stripe del cliente a obtener
   * * Retorna un cliente de stripe
   * @returns {Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>}
   */
  getCustomer(
    stripeId: string,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return this.stripeClient.customers.retrieve(stripeId);
  }

  async getCustomers(): Promise<Stripe.ApiListPromise<Stripe.Customer>> {
    return this.stripeClient.customers.list({
      limit: 0,
    });
  }

  async createCharge(
    stripeId: string,
    charge: StripeChargeDTO,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    return this.stripeClient.charges.create({ ...charge, customer: stripeId });
  }
}
