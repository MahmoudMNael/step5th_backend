import { TransactionType } from '@prisma/client';

export class GetTransactionResponseDto {
	id: number;
	orderId: number;
	recipientId: string;
	amount: number;
	type: TransactionType;
	createdAt: Date;
}
