import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import prisma from '../shared/utils/prisma/client';
import { getPaginationObject } from '../shared/utils/prisma/pagination-object';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async findOne(where: { email?: string; id?: string }) {
		return this.usersRepository.findOne(where);
	}

	async findOneIncludeWalletAndPlan(where: { email?: string; id?: string }) {
		return this.usersRepository.findOneIncludeWalletAndPlan(where);
	}

	async findOneWithPassword(where: { email?: string; id?: string }) {
		return this.usersRepository.findOneWithPassword(where);
	}

	async create(data: Prisma.UserCreateInput) {
		return this.usersRepository.create(data);
	}

	async findAll(where?: Prisma.UserWhereInput) {
		return this.usersRepository.findAll(where);
	}

	async findMany(filters: { id?: string }, paginationQuery?: PaginationDto) {
		let where = {};
		if (filters.id) {
			where = filters;
		}
		const paginationObject = paginationQuery
			? await getPaginationObject(prisma.user, paginationQuery, where)
			: undefined;

		const users = await prisma.user.findMany({
			where,
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				phoneNumber: true,
				role: true,
				parentConnectionId: true,
				UserWallets: {
					select: {
						balance: true,
						updatedAt: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
			skip: paginationObject?.skip,
			take: paginationObject?.limit,
		});

		return {
			users,
			pagination: {
				currentPage: paginationObject?.currentPage,
				totalPages: paginationObject?.totalPages,
				limit: paginationObject?.limit,
			},
		};
	}

	async update(id: string, data: Prisma.UserUpdateInput) {
		return this.usersRepository.update({ id }, data);
	}

	async delete(id: string) {
		return this.usersRepository.delete({ id });
	}
}
