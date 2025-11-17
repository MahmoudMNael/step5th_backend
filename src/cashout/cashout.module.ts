import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module';
import { CashoutController } from './cashout.controller';
import { CashoutService } from './cashout.service';

@Module({
	controllers: [CashoutController],
	providers: [CashoutService],
	imports: [TransactionsModule],
})
export class CashoutModule {}
