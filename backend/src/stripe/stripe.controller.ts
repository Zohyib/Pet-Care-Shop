import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  async createPaymentIntent(@Body() body: { amount: number, type: string, itemId: string }) {
    // Determine dynamically where payment is tied (Appointment or Shop Order)
    return this.stripeService.createPaymentIntent(body.amount, 'usd', {
      type: body.type,
      itemId: body.itemId,
    });
  }
}
