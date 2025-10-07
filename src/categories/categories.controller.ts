import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { ApiBadResponses } from '../shared/swagger/api-bad-responses.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { CategoriesService } from './categories.service';
import {
	CreateCategoryRequestDto,
	CreateCategoryResponseDto,
} from './dtos/create-category.dto';
import { GetOneCategoryResponseDto } from './dtos/getone-category.dto';
import { UpdateCategoryRequestDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(CreateCategoryResponseDto),
	})
	@ApiBadResponses([
		{
			statusCode: HttpStatus.UNAUTHORIZED,
			errorDescription: 'Unauthorized - not logged in',
		},
		{
			statusCode: HttpStatus.FORBIDDEN,
			errorDescription:
				'Forbidden - user does not have permission to access this resource',
		},
	])
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Category created successfully!')
	@Post('')
	async create(
		@Body() body: CreateCategoryRequestDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const category = await this.categoriesService.create(body);
		res.setHeader('Location', `/categories/${category.id}`);
		return category;
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetOneCategoryResponseDto, undefined, true),
		isArray: true,
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Categories retrieved successfully!')
	@Get('')
	async getAll(@I18n() i18n: I18nContext) {
		return this.categoriesService.getAll(i18n.lang as Language);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetOneCategoryResponseDto),
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Category retrieved successfully!')
	@Get(':categoryId')
	async getOne(
		@Param('categoryId') categoryId: number,
		@I18n() i18n: I18nContext,
	) {
		return this.categoriesService.getOne(categoryId, i18n.lang as Language);
	}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		type: GenericResponseType(),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Category deleted successfully!')
	@Delete(':categoryId')
	async delete(@Param('categoryId') categoryId: number) {
		await this.categoriesService.delete(categoryId);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetOneCategoryResponseDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Category updated successfully!')
	@Patch(':categoryId')
	async update(
		@Param('categoryId') categoryId: number,
		@Body() body: UpdateCategoryRequestDto,
	) {
		return this.categoriesService.update(categoryId, body);
	}
}
