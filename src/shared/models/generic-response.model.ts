import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
	@ApiProperty()
	currentPage: number;

	@ApiProperty()
	totalPages: number;

	@ApiProperty()
	limit: number;
}
export class GenericResponse<T> {
	constructor(data: T, pagination?: Pagination) {
		this.data = data;
		this.pagination = pagination;
	}

	message: string;
	data?: T;
	pagination?: Pagination;
}
