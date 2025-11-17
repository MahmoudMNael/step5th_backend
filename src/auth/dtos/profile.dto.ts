import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class ProfileResponseDto {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string | null;
	email: string;
	createdAt: Date;
	updatedAt: Date;
	UserWallets: { balance: number; updatedAt: Date }[];
	UserSubscriptions: {
		planId: number | null;
		subscribedAt: Date;
		expireAt: Date;
	}[];
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
