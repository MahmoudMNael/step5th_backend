import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class AcceptLanguageHeaderDto {
	@ApiProperty({
		enum: Language,
	})
	@IsEnum(Language)
	'Accept-Language': Language;
}
