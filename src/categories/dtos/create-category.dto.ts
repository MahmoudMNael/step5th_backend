import { IsString, MinLength } from 'class-validator';

export class CreateCategoryRequestDto {
	@MinLength(2)
	@IsString()
	name: string;
}

export class CreateCategoryResponseDto {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
