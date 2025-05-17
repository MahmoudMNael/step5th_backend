import { Injectable } from '@nestjs/common';
import { Language, Prisma } from '@prisma/client';
import prisma from 'src/shared/utils/prisma/client';

@Injectable()
export class CategoriesRepository {
	async findOne(categoryId: number, language?: Language) {
		return prisma.category.findFirst({
			where: {
				id: categoryId,
			},
			include: {
				CategoryTranslations: {
					where: {
						language,
					},
				},
			},
		});
	}

	async findMany(options?: {
		categoryWhere?: Prisma.CategoryWhereInput;
		translationWhere?: Prisma.CategoryTranslationWhereInput;
	}) {
		return prisma.category.findMany({
			where: options?.categoryWhere,
			include: {
				CategoryTranslations: {
					where: options?.translationWhere,
				},
			},
		});
	}

	async create(data: Prisma.CategoryCreateInput) {
		return prisma.category.create({
			data: {
				name: data.name,
			},
		});
	}

	async delete(categoryId: number) {
		return prisma.category.delete({
			where: {
				id: categoryId,
			},
		});
	}

	async update(categoryId: number, data: Prisma.CategoryUpdateInput) {
		return prisma.category.update({
			where: {
				id: categoryId,
			},
			data,
		});
	}
}
