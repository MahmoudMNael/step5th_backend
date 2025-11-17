import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePlanRequestDto {
	@MinLength(2)
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsNumber()
	price: number;

	@IsOptional()
	@IsNumber()
	annualDiscount?: number;
}
