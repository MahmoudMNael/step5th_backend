import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { PaymobModule } from '../paymob/paymob.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsEvents } from './subscriptions.events';
import { SubscriptionsService } from './subscriptions.service';

@Module({
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService, SubscriptionsEvents],
	imports: [UsersModule, PaymobModule, OrdersModule, TransactionsModule],
})
export class SubscriptionsModule {}
