import { Module } from '@nestjs/common';
import { CashoutService } from './cashout.service';
import { CashoutController } from './cashout.controller';

@Module({
  controllers: [CashoutController],
  providers: [CashoutService],
})
export class CashoutModule {}
