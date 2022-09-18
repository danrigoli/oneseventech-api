import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CartItem } from './models/cart-item';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get(':paymentIntentId')
  @HttpCode(200)
  getPayments(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentService.getPayment(paymentIntentId);
  }

  @Post()
  @HttpCode(201)
  createPayments(@Body() items: CartItem[]) {
    return this.paymentService.createPayment(items);
  }

  @Post('confirm/:paymentIntentId')
  @HttpCode(200)
  confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() paymentMethod: any,
  ) {
    return this.paymentService.confirmPayment(paymentIntentId, paymentMethod);
  }
}
