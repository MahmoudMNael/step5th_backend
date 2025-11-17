import { ApiProperty } from '@nestjs/swagger';
import { CashoutStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CashoutStatusQueryDto {
	@ApiProperty({
		enum: CashoutStatus,
	})
	@IsEnum(CashoutStatus)
	status: CashoutStatus;
}
