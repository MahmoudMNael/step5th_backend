import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymobService } from './paymob.service';

@Controller('paymob')
export class PaymobController {
	constructor(private readonly paymobService: PaymobService) {}

	@HttpCode(HttpStatus.OK)
	@Post('callback')
	async callback() {}
}
