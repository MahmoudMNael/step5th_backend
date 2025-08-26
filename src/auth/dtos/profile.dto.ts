import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

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
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;
}
