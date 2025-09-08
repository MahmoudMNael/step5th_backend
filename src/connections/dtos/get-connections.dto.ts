import { Role } from '@prisma/client';

export class GetConnectionDto {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string | null;
	role: string;
	ChildrenConnections: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string | null;
		role: Role;
	}[];
	UserWallets: {
		balance: number;
	}[];
}

export class GetParentConnectionDto {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string | null;
	role: string;
}
