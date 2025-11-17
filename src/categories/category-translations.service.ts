import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { CategoryTranslationsRepository } from './category-translations.repository';
import { CreateCategoryTranslationRequestDto } from './dtos/category-translation.dto';

@Injectable()
export class CategoryTranslationsService {
	constructor(
		private readonly categoryTranslationsRepository: CategoryTranslationsRepository,
	) {}

	async create(data: CreateCategoryTranslationRequestDto, categoryId: number) {
		return this.categoryTranslationsRepository.create(data, categoryId);
	}

	async getAll(categoryId: number) {
		return this.categoryTranslationsRepository.findMany({ categoryId });
	}

	async delete(categoryId: number, language: Language) {
		const translation = await this.categoryTranslationsRepository.findOne({
			categoryId_language: {
				categoryId,
				language,
			},
		});

		if (!translation) {
			throw new NotFoundException('Category translation not found');
		}

		await this.categoryTranslationsRepository.delete({
			categoryId_language: {
				categoryId,
				language,
			},
		});
	}
}
