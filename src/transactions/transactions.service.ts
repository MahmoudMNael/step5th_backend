import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, Prisma, TransactionType, User } from '@prisma/client';
import { ReferralsService } from '../referrals/referrals.service';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import prisma from '../shared/utils/prisma/client';
import { getPaginationObject } from '../shared/utils/prisma/pagination-object';

@Injectable()
export class TransactionsService {
	constructor(
		private readonly referralsService: ReferralsService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async create(data: Prisma.TransactionCreateInput, userId: string) {
		if (data.type == TransactionType.deducted) {
			prisma.userWallet.upsert({
				where: { userId },
				update: { balance: { decrement: data.amount } },
				create: { userId, balance: -data.amount },
			});
		} else if (
			data.type == TransactionType.added ||
			data.type == TransactionType.referred
		) {
			prisma.userWallet.upsert({
				where: { userId },
				update: { balance: { increment: data.amount } },
				create: { userId, balance: data.amount },
			});
		}

		return await prisma.transaction.create({ data });
	}

	async findManyByOrderId(orderId: number) {
		return await prisma.transaction.findMany({
			where: { orderId },
		});
	}

	async findManyByUserId(userId: string) {
		return await prisma.transaction.findMany({
			where: { Order: { userId } },
		});
	}

	async findMany(
		filters: { recipientId?: string; orderId?: number },
		paginationQuery?: PaginationDto,
	) {
		let where = filters;
		const paginationObject = paginationQuery
			? await getPaginationObject(prisma.transaction, paginationQuery, where)
			: undefined;

		const transactions = await prisma.transaction.findMany({
			where: {
				...filters,
			},
			orderBy: {
				createdAt: 'desc',
			},
			skip: paginationObject?.skip,
			take: paginationObject?.limit,
		});

		return {
			transactions,
			pagination: {
				currentPage: paginationObject?.currentPage,
				totalPages: paginationObject?.totalPages,
				limit: paginationObject?.limit,
			},
		};
	}

	async createReferralTransactions(userId: string, order: Order) {
		const referralMetadata = await this.referralsService.getReferralMetadata();

		let currentLevelUser = (await prisma.user.findUnique({
			where: { id: userId },
		})) as User;

		for (let i = 0; i < referralMetadata.numberOfLevels; i++) {
			if (!currentLevelUser.parentConnectionId) {
				break;
			}
			currentLevelUser = (await prisma.user.findUnique({
				where: { id: currentLevelUser.parentConnectionId },
			})) as User;

			if (i === 0) {
				this.create(
					{
						Order: { connect: { id: order.id } },
						amount: order.price * (referralMetadata.firstLevelPercentage / 100),
						Recipient: { connect: { id: currentLevelUser.id } },
						type: TransactionType.referred,
					},
					currentLevelUser.id,
				).then((transaction) => {
					this.eventEmitter.emit('transaction.created', { transaction });
				});
			} else if (
				i === referralMetadata.numberOfLevels - 1 ||
				!currentLevelUser.parentConnectionId
			) {
				this.create(
					{
						Order: { connect: { id: order.id } },
						amount: order.price * (referralMetadata.lastLevelPercentage / 100),
						Recipient: { connect: { id: currentLevelUser.id } },
						type: TransactionType.referred,
					},
					currentLevelUser.id,
				).then((transaction) => {
					this.eventEmitter.emit('transaction.created', { transaction });
				});
			} else {
				this.create(
					{
						Order: { connect: { id: order.id } },
						amount: order.price * (referralMetadata.midLevelsPercentage / 100),
						Recipient: { connect: { id: currentLevelUser.id } },
						type: TransactionType.referred,
					},
					currentLevelUser.id,
				).then((transaction) => {
					this.eventEmitter.emit('transaction.created', { transaction });
				});
			}
		}
	}
}
