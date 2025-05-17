import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CategoryTranslationsController } from './category-translations.controller';
import { CategoryTranslationsRepository } from './category-translations.repository';
import { CategoryTranslationsService } from './category-translations.service';

@Module({
	controllers: [CategoriesController, CategoryTranslationsController],
	providers: [
		CategoriesService,
		CategoryTranslationsService,
		CategoriesRepository,
		CategoryTranslationsRepository,
	],
})
export class CategoriesModule {}
