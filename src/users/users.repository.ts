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
}
