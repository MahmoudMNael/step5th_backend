import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateCategoryTranslationRequestDto {
	@MinLength(2)
	@IsString()
	name: string;

	@ApiProperty({
		enum: Language,
	})
	@IsEnum(Language)
	language: Language;
}

export class CategoryTranslationDto {
	categoryId: number;
	name: string;
	language: Language;
	createdAt: Date;
	updatedAt: Date;
}
