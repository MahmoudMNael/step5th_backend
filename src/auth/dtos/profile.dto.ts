import {
	IsOptional,
	IsPhoneNumber,
	IsString,
	MinLength,
} from 'class-validator';

export class ProfileResponseDto {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string | null;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export class UpdateProfileRequestDto {
	@IsOptional()
	@MinLength(2)
	@IsString()
	firstName?: string;

	@IsOptional()
	@MinLength(2)
	@IsString()
	lastName?: string;

	@IsOptional()
	@MinLength(2)
	@IsPhoneNumber()
	phoneNumber?: string;
}
