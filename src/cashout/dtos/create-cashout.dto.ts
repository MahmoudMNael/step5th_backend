import { ApiProperty } from '@nestjs/swagger';
import { CashoutProvider, CashoutStatus } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateCashoutRequestDto {
	@MinLength(10)
	@IsString()
	handle: string;

	@ApiProperty({
		enum: CashoutProvider,
	})
	@IsEnum(CashoutProvider)
	provider: CashoutProvider;
}

export class CreateCashoutResponseDto {
	id: number;
	userId: string;
	handle: string;
	provider: CashoutProvider;
	notes: string | null;
	status: CashoutStatus;
	createdAt: Date;
	updatedAt: Date;
}
