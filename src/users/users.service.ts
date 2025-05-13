import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async findOne(where: { email?: string; id?: string }) {
		return this.usersRepository.findOne(where);
	}

	async findOneWithPassword(where: { email?: string; id?: string }) {
		return this.usersRepository.findOneWithPassword(where);
	}

	async create(data: Prisma.UserCreateInput) {
		return this.usersRepository.create(data);
	}
}
