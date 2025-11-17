import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class GetArticlesPreviewRequestDto extends PaginationDto {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	categoryId?: number;

	@IsOptional()
	@MinLength(2)
	@IsString()
	search?: string;
}

export class GetArticlePreviewDto {
	id: number;
	title: string;
	description: string;
	updatedAt: Date;
	createdAt: Date;
	UpdatedBy: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	} | null;
	Category: {
		id: number;
		planId: number | null;
	};
	Thumbnail: {
		id: number;
		mime: string;
		name: string;
	} | null;
	isLocked: boolean;
}
