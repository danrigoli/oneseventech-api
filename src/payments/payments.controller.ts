import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Response } from 'express';
import { CartItem } from './models/cart-item';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get(':paymentIntentId')
  getPayments(
    @Res() response: Response,
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    this.paymentService
      .getPayment(paymentIntentId)
      .then((res) => {
        response.status(HttpStatus.CREATED).json(res);
      })
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }

  @Post()
  createPayments(@Res() response: Response, @Body() items: CartItem[]) {
    this.paymentService
      .createPayment(items)
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
