import { Module } from '@nestjs/common';
import { PaymobService } from './paymob.service';
import { PaymobController } from './paymob.controller';

@Module({
  controllers: [PaymobController],
  providers: [PaymobService],
})
export class PaymobModule {}
