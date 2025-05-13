export class ProfileResponseDto {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string | null;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}
