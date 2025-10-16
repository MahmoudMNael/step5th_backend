import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PaymobService } from './paymob.service';

@Controller('paymob')
export class PaymobController {
	constructor(private readonly paymobService: PaymobService) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('callback')
	async callback(@Body() body: any) {
		this.paymobService.handleCallback(body);

		return;
	}

	@Get('response')
	getResponse(@Query() query, @Res() res: Response) {
		res.render('payment-response', {
			status: query['data.message'],
			success: query['success'] === 'true',
			orderId: query['order'],
			amount: +query['amount_cents'] / 100,
			currency: query['currency'],
		});
	}
}
