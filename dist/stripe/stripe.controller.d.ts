import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { UpdateResult } from 'typeorm';
import { ClientesService } from '@sanfrancisco/clientes/clientes.service';
import { StripeChargeDTO } from './dtos/stripeCharge.dto';
export declare class StripeController {
    private readonly stripeService;
    private readonly clientesService;
    constructor(stripeService: StripeService, clientesService: ClientesService);
    createCustomer(customerId: number): Promise<UpdateResult>;
    getCustomer(stripeId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    getCustomers(): Promise<Stripe.ApiListPromise<Stripe.Customer>>;
    createCharge(stripeId: string, charge: StripeChargeDTO): Promise<Stripe.Response<Stripe.Charge>>;
}
