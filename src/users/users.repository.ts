import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/shared/utils/prisma/client';

@Injectable()
export class UsersRepository {
	async findOne(where: { email?: string; id?: string }) {
		return prisma.user.findFirst({
			where,
		});
	}

	async findOneWithPassword(where: { email?: string; id?: string }) {
		return prisma.user.findFirst({
			where,
			omit: {
				password: false,
				salt: false,
			},
		});
	}

	async create(data: Prisma.UserCreateInput) {
		return prisma.user.create({
			data,
		});
	}

	async findAll(where?: Prisma.UserWhereInput) {
		return prisma.user.findMany({
			where,
		});
	}

	async update(where: { id: string }, data: Prisma.UserUpdateInput) {
		return prisma.user.update({
			where,
			data,
		});
	}

	async delete(where: { id: string }) {
		return prisma.user.delete({
			where,
		});
	}
}
