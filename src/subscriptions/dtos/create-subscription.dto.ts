import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateSubscriptionRequestDto {
	@IsNumber()
	planId: number;

	@IsOptional()
	@IsBoolean()
	isAnnual?: boolean;
}

export class CreateSubscriptionResponseDto {
	orderId: number;
	amountCents: number;
	paymentUrl: string;
}
