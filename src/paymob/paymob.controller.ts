import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
