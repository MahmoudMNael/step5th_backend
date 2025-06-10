import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/auth/guards/roles.guard';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import prisma from 'src/shared/utils/prisma/client';
import { getPaginationObject } from 'src/shared/utils/prisma/pagination-object';
import {
	CreateArticleRequestDto,
	CreateArticleThumbnailDto,
} from './dtos/create-article.dto';

@Injectable()
export class ArticlesService {
	async create(body: CreateArticleThumbnailDto, authorId?: string) {
		const article = await prisma.article.create({
			data: {
				title: body.title,
				description: body.description,
				content: body.content,
				categoryId: body.categoryId,
				thumbnailId: body.thumbnail?.id || null,
				authorId: authorId || null,
			},
		});

		return article;
	}

	async findAllPreviews(
		userRole: Role,
		categoryId?: number,
		search?: string,
		paginationQuery?: PaginationDto,
	) {
		let where: any = {};

		if (categoryId) {
			where.categoryId = categoryId;
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
				{ content: { contains: search, mode: 'insensitive' } },
			];
		}

		const paginationObject = paginationQuery
			? await getPaginationObject(prisma.article, paginationQuery, where)
			: undefined;

		let articles = await prisma.article.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				content: true,
				updatedAt: true,
				createdAt: true,
				Category: {
					select: {
						id: true,
						planId: true,
					},
				},
				Thumbnail: {
					select: {
						id: true,
						mime: true,
						name: true,
					},
				},
			},
			where,
			orderBy: {
				updatedAt: 'desc',
			},
			skip: paginationObject?.skip,
			take: paginationObject?.limit,
		});

		let prioritizedArticles: {
			id: number;
			title: string;
			description: string;
			content: string;
			updatedAt: Date;
			createdAt: Date;
			Category: {
				id: number;
				planId: number | null;
			};
			Thumbnail: {
				id: number;
				mime: string;
				name: string;
			} | null;
			priority?: number;
		}[] = articles;

		if (search) {
			const searchLower = search.toLowerCase();
			prioritizedArticles = articles
				.map((article) => {
					if (article.title?.toLowerCase().includes(searchLower)) {
						return { ...article, priority: 1 };
					} else if (article.description?.toLowerCase().includes(searchLower)) {
						return { ...article, priority: 2 };
					} else {
						return { ...article, priority: 3 };
					}
				})
				.sort((a: any, b: any) => {
					if (a.priority !== b.priority) return a.priority - b.priority;
					return (
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
				});
		}

		const result = prioritizedArticles.map(
			({ content, priority, Category, ...rest }) => {
				let isLocked = false;
				if (userRole === 'USER' && Category.planId) {
					isLocked = true;
				}
				return {
					...rest,
					Category,
					isLocked,
				};
			},
		);

		return {
			result,
			pagination: {
				currentPage: paginationObject?.currentPage,
				totalPages: paginationObject?.totalPages,
				limit: paginationObject?.limit,
			},
		};
	}

	async update(id: number, body: CreateArticleRequestDto) {
		const existingArticle = await prisma.article.findUnique({
			where: { id },
		});

		if (!existingArticle) {
			throw new NotFoundException(`Article not found`);
		}

		return prisma.article.update({
			where: { id },
			data: {
				...body,
			},
		});
	}

	async remove(id: number) {
		const existingArticle = await prisma.article.findUnique({
			where: { id },
		});

		if (!existingArticle) {
			throw new NotFoundException(`Article not found`);
		}

		await prisma.article.delete({
			where: { id },
		});
	}
}
