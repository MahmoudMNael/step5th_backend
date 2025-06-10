import { PaginationDto } from 'src/shared/dtos/pagination.dto';

export async function getPaginationObject(
	module: any,
	query: PaginationDto,
	where?: any,
) {
	const page = query.page ?? 1;
	const count = await module.count({ where });
	const limit = query.limit ?? 10;
	const skip = (page - 1) * limit;

	return {
		totalPages: Math.ceil(count / limit),
		currentPage: page,
		totalCount: count,
		limit,
		skip,
	};
}
