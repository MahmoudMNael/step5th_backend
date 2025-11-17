export class UserWalletDto {
	balance: number;
	updatedAt: Date;
}

export class GetUsersResponseDto {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	role: string;
	parentConnectionId?: string | null;
	UserWallets: UserWalletDto[];
	createdAt: Date;
	updatedAt: Date;
}
