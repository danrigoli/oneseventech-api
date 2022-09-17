import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Product } from './models/product';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  createPayment(
    products: Product[],
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const total = products.reduce((acc, product) => {
      return acc + product.data.price * product.quantity;
    }, 0);
    return this.stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'usd',
    });
  }

  async confirmPayment(
    paymentIntentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 9,
        exp_year: 2023,
        cvc: '314',
      },
    });

    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
    });
  }
}
