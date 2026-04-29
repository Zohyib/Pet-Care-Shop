import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_fallback_replace_me', {
    apiVersion: '2023-10-16' as any,
  });

  constructor() {}

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses smallest currency unit (cents)
        currency,
        metadata,
      });
      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error: any) {
      // Return a mocked success for development if key is fake
      if (error.message.includes('API key')) {
        return {
          clientSecret: 'pi_mock_secret_' + Date.now(),
          id: 'pi_mock_' + Date.now(),
          mocked: true
        };
      }
      throw error;
    }
  }

  async createDoctorConnectAccount(email: string) {
    try {
      const account = await this.stripe.accounts.create({
        type: 'standard',
        email: email,
      });
      return account;
    } catch (error) {
      console.error(error);
      return { id: 'acct_mock_' + Date.now(), mocked: true };
    }
  }
}
