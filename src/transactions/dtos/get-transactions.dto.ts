import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class GetTransactionsQueryParamsDto extends PaginationDto {
	@IsOptional()
	@IsString()
	recipientId?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	orderId?: number;
}
