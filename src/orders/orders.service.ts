import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import prisma from '../shared/utils/prisma/client';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
	async create(data: CreateOrderDto) {
		const order = await prisma.order.create({
			data,
		});

		return order;
	}

	async findOne(id: number) {
		const order = await prisma.order.findUnique({
			where: { id },
		});

		return order;
	}

	async findMany(where: Prisma.OrderWhereInput) {
		const orders = await prisma.order.findMany({
			where,
		});

		return orders;
	}

	async updateStatus(id: number, status: OrderStatus) {
		const updatedOrder = await prisma.order.update({
			where: { id },
			data: { status },
		});

		return updatedOrder;
	}
}
