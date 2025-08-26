import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus, Role } from '@prisma/client';
import prisma from '../shared/utils/prisma/client';

@Injectable()
export class TasksService {
	@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
	async deleteOverStayedPendingOrders() {
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

		prisma.order.deleteMany({
			where: {
				status: OrderStatus.pending,
				createdAt: {
					lte: oneDayAgo,
				},
			},
		});
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleExpiredSubscriptions() {
		const now = new Date();

		const expiredSubscriptions = await prisma.userSubscription.findMany({
			where: {
				isActive: true,
				expireAt: {
					lte: now,
				},
			},
		});

		for (const subscription of expiredSubscriptions) {
			prisma.userSubscription.update({
				where: { id: subscription.id },
				data: { isActive: false },
			});

			if (subscription.userId == null) continue;

			prisma.user.update({
				where: { id: subscription.userId },
				data: {
					role: Role.USER,
				},
			});
		}
	}
}
