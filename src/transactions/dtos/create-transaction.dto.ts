import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateTransactionRequestDto {
	@IsNumber()
	amount: number;

	@ApiProperty({
		enum: TransactionType,
	})
	@IsEnum(TransactionType)
	type: TransactionType;
}
