import { Injectable } from '@nestjs/common';
import { Language, Prisma } from '@prisma/client';
import prisma from 'src/shared/utils/prisma/client';

@Injectable()
export class CategoryTranslationsRepository {
	async create(data: { name: string; language: Language }, categoryId: number) {
		return prisma.categoryTranslation.create({
			data: {
				name: data.name,
				language: data.language,
				categoryId,
			},
		});
	}

	async createMany(
		data: { name: string; language: Language }[],
		categoryId: number,
	) {
		return prisma.categoryTranslation.createManyAndReturn({
			data: data.map((item) => {
				return {
					name: item.name,
					language: item.language,
					categoryId,
				};
			}),
		});
	}

	async findMany(where: Prisma.CategoryTranslationWhereInput) {
		return prisma.categoryTranslation.findMany({
			where,
		});
	}

	async findOne(where: Prisma.CategoryTranslationWhereUniqueInput) {
		return prisma.categoryTranslation.findUnique({
			where,
		});
	}

	async delete(where: Prisma.CategoryTranslationWhereUniqueInput) {
		return prisma.categoryTranslation.delete({
			where,
		});
	}
}
