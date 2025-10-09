export class GetArticleDto {
	id: number;
	title: string;
	description: string;
	content: string;
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
}
