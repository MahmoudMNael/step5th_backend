import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus, Role, TransactionType } from '@prisma/client';
import { RequestUser } from '../auth/decorators/user.decorator';
import { OrdersService } from '../orders/orders.service';
import { PaymobService } from '../paymob/paymob.service';
import prisma from '../shared/utils/prisma/client';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { CreateSubscriptionRequestDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
	constructor(
		private readonly usersService: UsersService,
		private readonly paymobService: PaymobService,
		private readonly ordersService: OrdersService,
		private readonly eventEmitter: EventEmitter2,
		private readonly transactionsService: TransactionsService,
	) {}

	async initiateOrder(
		body: CreateSubscriptionRequestDto,
		reqUser: RequestUser,
	) {
		const user = await this.usersService.findOne({ id: reqUser.id });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const userSubscription = await prisma.userSubscription.findFirst({
			where: { userId: user.id, isActive: true },
		});

		if (userSubscription) {
			throw new ConflictException('User already has an active subscription');
		}

		const plan = await prisma.plan.findUnique({ where: { id: body.planId } });

		if (!plan) {
			throw new NotFoundException('Plan not found');
		}

		const annualPrice = plan.price * 12;

		const price = body.isAnnual
			? annualPrice - annualPrice * (plan.annualDiscount / 100)
			: plan.price;

		const orderRequestData = {
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phoneNumber: user.phoneNumber,
			productName: plan.name,
			priceCents: Number((price * 100).toFixed(0)),
		};

		try {
			const orderResponse = await this.paymobService.initiateOrder(
				orderRequestData,
				body.isAnnual ?? false,
			);

			this.ordersService.create({
				id: orderResponse.orderId,
				userId: user.id,
				planId: plan.id,
				isAnnual: body.isAnnual ?? false,
				price: Number((orderResponse.amountCents / 100).toFixed(3)),
				status: OrderStatus.pending,
			});

			return orderResponse;
		} catch (error) {
			throw error;
		}
	}

	async initiateUserSubscription(order: Order) {
		const user = await this.usersService.findOne({ id: order.userId! });

		prisma.userSubscription
			.create({
				data: {
					userId: order.userId,
					planId: order.planId,
					isActive: true,
					subscribedAt: order.updatedAt,
					expireAt: new Date(
						new Date(order.updatedAt).getTime() + (order.isAnnual ? 365 : 30),
					),
				},
			})
			.then((userSubscription) => {
				this.eventEmitter.emit('subscription.started', {
					user,
					userSubscription,
				});
			});

		this.usersService.update(user!.id, { role: Role.SUBSCRIBER });

		return;
	}

	async handlePaymentSuccess(orderId: number) {
		const order = await this.ordersService.findOne(orderId);

		if (!order) {
			throw new NotFoundException('Order not found');
		}

		if (order.status !== OrderStatus.pending) {
			throw new ConflictException(
				'Order is not in a valid state for payment processing',
			);
		}

		this.ordersService.updateStatus(orderId, OrderStatus.approved);

		this.initiateUserSubscription(order);

		this.transactionsService.create(
			{
				Order: { connect: { id: order.id } },
				amount: order.price,
				type: TransactionType.order,
			},
			order.userId!,
		);

		this.transactionsService.createReferralTransactions(order.userId!, order);

		return;
	}

	async handlePaymentFailure(orderId: number) {
		const order = await this.ordersService.findOne(orderId);

		if (!order) {
			throw new NotFoundException('Order not found');
		}

		if (order.status !== OrderStatus.pending) {
			throw new ConflictException(
				'Order is not in a valid state for payment processing',
			);
		}

		await this.ordersService.updateStatus(orderId, OrderStatus.failed);

		return;
	}
}
