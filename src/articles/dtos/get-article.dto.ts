export class GetArticleDto {
	id: number;
	title: string;
	description: string;
	content: string;
	updatedAt: Date;
	createdAt: Date;
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
