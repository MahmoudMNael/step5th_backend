import { Module } from '@nestjs/common';
import { ReferralsModule } from '../referrals/referrals.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsEvents } from './transactions.events';
import { TransactionsService } from './transactions.service';

@Module({
	controllers: [TransactionsController],
	providers: [TransactionsService, TransactionsEvents],
	exports: [TransactionsService],
	imports: [ReferralsModule],
})
export class TransactionsModule {}
