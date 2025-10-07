import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class GetUsersQueryDto extends PaginationDto {
	@IsOptional()
	@IsString()
	userId?: string;
}
