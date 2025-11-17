import { ApiProperty } from '@nestjs/swagger';
import { CashoutStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PatchCashoutRequestDto {
	@ApiProperty({
		enum: CashoutStatus,
	})
	@IsEnum(CashoutStatus)
	status: CashoutStatus;

	@IsOptional()
	@IsString()
	notes?: string;
}
