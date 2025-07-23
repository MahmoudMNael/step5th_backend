import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RequestUser, User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Role, RolesGuard } from 'src/auth/guards/roles.guard';
import { FilesService } from 'src/files/files.service';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { Pagination } from 'src/shared/models/generic-response.model';
import { GenericResponseType } from 'src/shared/swagger/generic-response-type';
import { ArticlesService } from './articles.service';
import {
	CreateArticleRequestDto,
	CreateArticleThumbnailDto,
} from './dtos/create-article.dto';
import { GetArticleDto } from './dtos/get-article.dto';
import {
	GetArticlePreviewDto,
	GetArticlesPreviewRequestDto,
} from './dtos/get-articles-preview.dto';

@Controller('articles')
export class ArticlesController {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly filesService: FilesService,
	) {}

	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				description: { type: 'string' },
				content: { type: 'string' },
				categoryId: { type: 'number' },
				thumbnail: { type: 'string', format: 'binary' },
			},
			required: ['title', 'description', 'content', 'categoryId'],
		},
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@UseInterceptors(FileInterceptor('thumbnail'))
	@ResponseMessage('Article created successfully!')
	@HttpCode(HttpStatus.CREATED)
	@Post('')
	async create(
		@UploadedFile() thumbnail: Express.Multer.File,
		@Body() body: CreateArticleRequestDto,
		@User() user: RequestUser,
	) {
		let newBody: CreateArticleThumbnailDto = { ...body, thumbnail: undefined };
		if (thumbnail) {
			const storedFile = await this.filesService.uploadFile(thumbnail);
			newBody.thumbnail = storedFile;
		}

		const article = await this.articlesService.create(newBody, user.id);

		return article;
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetArticlePreviewDto, Pagination, true),
		isArray: true,
	})
	@ResponseMessage('Articles retrieved successfully!')
	@HttpCode(HttpStatus.OK)
	@Get('')
	async findAll(
		@Query() query: GetArticlesPreviewRequestDto,
		@User() user?: RequestUser,
	) {
		const articles = await this.articlesService.findAllPreviews(
			user ? user.role : Role.USER,
			query.categoryId,
			query.search,
			{ page: query.page, limit: query.limit },
		);

		return articles;
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetArticleDto),
	})
	@ResponseMessage('Article retrieved successfully!')
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async findOne(@Param('id') id: number, @User() user?: RequestUser) {
		const article = await this.articlesService.findOne(
			id,
			user ? user.role : Role.USER,
		);

		return article;
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Article updated successfully!')
	@HttpCode(HttpStatus.OK)
	@Put(':id')
	async update(@Param('id') id: number, @Body() body: CreateArticleRequestDto) {
		const updatedArticle = await this.articlesService.update(id, body);
		return updatedArticle;
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Article deleted successfully!')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: number) {
		await this.articlesService.remove(id);
		return;
	}
}
