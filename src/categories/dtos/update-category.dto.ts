import { IsString, MinLength } from 'class-validator';

export class UpdateCategoryRequestDto {
	@MinLength(2)
	@IsString()
	name: string;
}
