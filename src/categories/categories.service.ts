import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { CategoriesRepository } from './categories.repository';
import { CategoryTranslationsRepository } from './category-translations.repository';
import { CreateCategoryRequestDto } from './dtos/create-category.dto';
import { UpdateCategoryRequestDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
	constructor(
		private readonly categoriesRepository: CategoriesRepository,
		private readonly categoryTranslationsRepository: CategoryTranslationsRepository,
	) {}

	async getOne(categoryId: number, language: Language) {
		const category = await this.categoriesRepository.findOne(
			categoryId,
			language,
		);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return {
			id: category.id,
			name: category.CategoryTranslations[0]?.name ?? category.name,
			planId: category.planId,
			createdAt: category.createdAt,
			updatedAt: category.updatedAt,
		};
	}

	async getAll(language: Language) {
		const result = await this.categoriesRepository.findMany({
			translationWhere: { language },
		});

		return result.map((category) => {
			return {
				id: category.id,
				name: category.CategoryTranslations[0]?.name ?? category.name,
				planId: category.planId,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
			};
		});
	}

	async create(data: CreateCategoryRequestDto) {
		return this.categoriesRepository.create(data);
	}

	async delete(categoryId: number) {
		const category = await this.categoriesRepository.findOne(categoryId);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		this.categoriesRepository.delete(categoryId);
		return;
	}

	async update(categoryId: number, data: UpdateCategoryRequestDto) {
		const category = await this.categoriesRepository.findOne(categoryId);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return this.categoriesRepository.update(categoryId, data);
	}

	// async createTranslation(data: CreateCategoryTranslationRequestDto) {}
}
