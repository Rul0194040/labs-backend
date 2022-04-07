import Stripe from 'stripe';
import { StripeChargeDTO } from './dtos/stripeCharge.dto';
import { StripeCustomerDTO } from './dtos/stripeCustomer.dto';
export declare class StripeService {
    private readonly stripeClient;
    constructor(stripeClient: Stripe);
    private readonly logger;
    createCustomer(customerToCreate: StripeCustomerDTO): Promise<Stripe.Response<Stripe.Customer>>;
    getCustomer(stripeId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    getCustomers(): Promise<Stripe.ApiListPromise<Stripe.Customer>>;
    createCharge(stripeId: string, charge: StripeChargeDTO): Promise<Stripe.Response<Stripe.Charge>>;
}
