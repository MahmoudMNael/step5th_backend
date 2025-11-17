export class PlanDto {
	id: number;
	name: string;
	description?: string;
	price: number;
	annualDiscount?: number;
	createdAt: Date;
	updatedAt: Date;
}
