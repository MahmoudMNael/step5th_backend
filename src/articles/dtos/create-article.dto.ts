import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateArticleRequestDto {
	@MinLength(2)
	@IsString()
	title: string;

	@MinLength(2)
	@IsString()
	description: string;

	@MinLength(2)
	@IsString()
	content: string;

	@IsNumber()
	categoryId: number;
}

export type CreateArticleThumbnailDto = CreateArticleRequestDto & {
	thumbnail?: {
		id: number;
		createdAt: Date;
		updatedAt: Date;
		name: string;
		mime: string;
		path: string;
	};
};
