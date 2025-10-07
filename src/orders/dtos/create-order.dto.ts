import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
	id: number;
	userId: string;
	planId: number;
	isAnnual: boolean;
	price: number;
	status: OrderStatus;
}
