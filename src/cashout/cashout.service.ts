import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CashoutStatus, Prisma, Role, TransactionType } from '@prisma/client';
import prisma from '../shared/utils/prisma/client';
import { TransactionsService } from '../transactions/transactions.service';
import { CashoutStatusQueryDto } from './dtos/cashout-status.dto';
import { CreateCashoutRequestDto } from './dtos/create-cashout.dto';

@Injectable()
export class CashoutService {
	constructor(private readonly transactionsService: TransactionsService) {}

	async create(body: CreateCashoutRequestDto, userId: string) {
		const existingCashout = await prisma.cashoutRequest.findFirst({
			where: {
				userId,
				status: CashoutStatus.PENDING,
			},
		});

		const userWallet = await prisma.userWallet.findUnique({
			where: { userId },
			select: { balance: true },
		});

		if (!userWallet || userWallet.balance <= 0) {
			throw new ConflictException('Insufficient balance for cashout request');
		}

		if (existingCashout) {
			throw new ConflictException('You already have a pending cashout request');
		}

		const cashout = await prisma.cashoutRequest.create({
			data: {
				...body,
				userId,
			},
		});

		return cashout;
	}

	async findOne(id: number, userId: string) {
		const cashout = await prisma.cashoutRequest.findUnique({
			where: { id },
			include: {
				User: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						UserWallets: { select: { balance: true } },
					},
				},
			},
		});

		if (!cashout) {
			throw new NotFoundException(`Cashout request with ID ${id} not found`);
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { role: true },
		});

		if (user!.role !== Role.ADMIN && cashout.userId !== userId) {
			throw new ForbiddenException(
				'You do not have access to this cashout request',
			);
		}

		return cashout;
	}

	async findAll(query: CashoutStatusQueryDto, userId: string, userRole: Role) {
		let where: Prisma.CashoutRequestWhereInput = {
			status: query.status,
		};

		if (userRole !== Role.ADMIN) {
			where.userId = userId;
		}

		const cashoutRequests = await prisma.cashoutRequest.findMany({
			where,
			include: {
				User: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						UserWallets: { select: { balance: true } },
					},
				},
			},
		});

		return cashoutRequests;
	}

	async updateStatus(id: number, status: CashoutStatus, notes?: string) {
		const cashout = await prisma.cashoutRequest.findUnique({
			where: { id },
		});

		if (!cashout) {
			throw new NotFoundException(`Cashout request with ID ${id} not found`);
		}

		if (cashout.status !== CashoutStatus.PENDING) {
			throw new ConflictException(
				'Only pending cashout requests can be updated',
			);
		}

		if (status == CashoutStatus.RESOLVED) {
			const amount = await prisma.userWallet.findUnique({
				where: { userId: cashout.userId },
				select: { balance: true },
			});

			await this.transactionsService.create(
				{ type: TransactionType.deducted, amount: amount?.balance || 0 },
				cashout.userId,
			);
		}

		const updatedCashout = await prisma.cashoutRequest.update({
			where: { id },
			data: { status, notes },
		});

		return updatedCashout;
	}

	async deleteOne(id: number, userId: string) {
		const cashout = await prisma.cashoutRequest.findUnique({
			where: { id },
		});

		if (!cashout) {
			throw new NotFoundException(`Cashout request with ID ${id} not found`);
		}

		if (cashout.userId !== userId) {
			throw new ForbiddenException(
				'You do not have permission to delete this cashout request',
			);
		}

		if (cashout.status !== CashoutStatus.PENDING) {
			throw new ConflictException(
				'Only pending cashout requests can be deleted',
			);
		}

		await prisma.cashoutRequest.delete({
			where: { id },
		});

		return;
	}
}
