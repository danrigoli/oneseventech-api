import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Response } from 'express';
import { Product } from './models/product';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  createPayments(
    @Res() response: Response,
    @Body() paymentRequestBody: Product[],
  ) {
    this.paymentService
      .createPayment(paymentRequestBody)
      .then((res) => {
        response.status(HttpStatus.CREATED).json(res);
      })
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }

  @Post('confirm/:paymentIntentId')
  confirmPayment(
    @Res() response: Response,
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    this.paymentService
      .confirmPayment(paymentIntentId)
      .then((res) => {
        response.status(HttpStatus.CREATED).json(res);
      })
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
