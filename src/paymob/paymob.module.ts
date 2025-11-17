import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymobController } from './paymob.controller';
import { PaymobService } from './paymob.service';

@Module({
	imports: [HttpModule],
	controllers: [PaymobController],
	providers: [PaymobService],
	exports: [PaymobService],
})
export class PaymobModule {}
