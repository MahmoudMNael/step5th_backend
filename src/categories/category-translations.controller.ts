import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { CategoryTranslationsService } from './category-translations.service';
import {
	CategoryTranslationDto,
	CreateCategoryTranslationRequestDto,
} from './dtos/category-translation.dto';

@Controller(':categoryId/translations')
export class CategoryTranslationsController {
	constructor(
		private readonly categoryTranslationsService: CategoryTranslationsService,
	) {}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(CategoryTranslationDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('Category translation created successfully!')
	@Post('')
	async create(
		@Param('categoryId') categoryId: number,
		@Body() body: CreateCategoryTranslationRequestDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const createdTranslation = await this.categoryTranslationsService.create(
			body,
			categoryId,
		);
		res.setHeader('Location', `/categories/${categoryId}/translations/`);
		return createdTranslation;
	}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(CategoryTranslationDto, undefined, true),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Category translation retrieved successfully!')
	@Get('')
	async getAll(@Param('categoryId') categoryId: number) {
		return this.categoryTranslationsService.getAll(categoryId);
	}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		type: GenericResponseType(),
	})
	@ApiParam({
		name: 'language',
		type: 'string',
		enum: Language,
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Category translation deleted successfully!')
	@Delete(':language')
	async delete(
		@Param('categoryId') categoryId: number,
		@Param('language') language: Language,
	) {
		await this.categoryTranslationsService.delete(categoryId, language);
	}
}
