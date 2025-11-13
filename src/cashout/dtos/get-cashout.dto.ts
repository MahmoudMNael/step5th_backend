import { ApiProperty } from '@nestjs/swagger';
import { CashoutProvider, CashoutStatus } from '@prisma/client';

export class GetCashoutResponseDto {
	id: number;
	userId: string;
	handle: string;
	notes: string | null;

	@ApiProperty({
		enum: CashoutStatus,
	})
	status: CashoutStatus;

	@ApiProperty({
		enum: CashoutProvider,
	})
	provider: CashoutProvider;
	createdAt: Date;
	updatedAt: Date;
	User: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		UserWallets: {
			balance: number;
		}[];
	};
}
