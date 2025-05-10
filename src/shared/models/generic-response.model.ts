export type Pagination = {
	pages: number;
	limit: number;
};

export class GenericResponse<T> {
	status: string;
	data?: T;
	pagination?: Pagination;
}
