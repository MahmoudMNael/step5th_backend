import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from '@prisma/client';
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
}
