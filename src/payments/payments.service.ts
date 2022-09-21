import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartItem } from './models/cart-item';
import { PaymentMethod } from './models/payment-method';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  getPayment(
    paymentIntentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  createPayment(
    items: CartItem[],
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const subtotal = items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const total = subtotal * 1.06 * 100;
    return this.stripe.paymentIntents.create({
      amount: Number(total.toFixed(0)),
      currency: 'usd',
    });
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodData: PaymentMethod,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: paymentMethodData.cardNumber,
        exp_month: paymentMethodData.expiryMonth,
        exp_year: paymentMethodData.expiryYear,
        cvc: paymentMethodData.cvc,
      },
      billing_details: {
        name: paymentMethodData.name,
        address: {
          line1: paymentMethodData.address,
          city: paymentMethodData.city,
          state: paymentMethodData.state,
          postal_code: paymentMethodData.zip,
          country: paymentMethodData.country,
        },
      },
    });

    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
    });
  }
}
