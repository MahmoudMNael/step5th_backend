import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryRequestDto {
	@MinLength(2)
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	planId?: number;
}
