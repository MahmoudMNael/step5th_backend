import { Injectable, NotFoundException } from '@nestjs/common';
import prisma from '../shared/utils/prisma/client';
import { CreatePlanRequestDto } from './dtos/create-plan.dto';

@Injectable()
export class PlansService {
	findAll() {
		return prisma.plan.findMany();
	}

	async create(data: CreatePlanRequestDto) {
		return prisma.plan.create({
			data: {
				name: data.name,
				description: data.description ?? undefined,
				price: data.price,
				annualDiscount: data.annualDiscount ?? undefined,
			},
		});
	}

	async findOne(planId: number) {
		const plan = await prisma.plan.findUnique({
			where: { id: planId },
		});

		if (!plan) {
			throw new NotFoundException(`Plan not found`);
		}

		return plan;
	}

	async update(planId: number, data: CreatePlanRequestDto) {
		const plan = await this.findOne(planId);

		return prisma.plan.update({
			where: { id: plan.id },
			data: {
				name: data.name,
				description: data.description ?? undefined,
				price: data.price,
				annualDiscount: data.annualDiscount ?? undefined,
			},
		});
	}

	async delete(planId: number) {
		const plan = await this.findOne(planId);

		if (!plan || plan.isDisabled) {
			throw new NotFoundException(`Plan not found`);
		}

		return prisma.plan.update({
			where: { id: planId },
			data: { isDisabled: true },
		});
	}
}
