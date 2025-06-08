import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryRequestDto {
	@MinLength(2)
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	planId?: number;
}

export class CreateCategoryResponseDto {
	id: number;
	name: string;
	planId?: number;
	createdAt: Date;
	updatedAt: Date;
}
