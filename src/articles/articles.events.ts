import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications/notifications.service';
import { UserTokensService } from '../notifications/user-tokens.service';

@Injectable()
export class ArticlesEvents {
	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly tokensService: UserTokensService,
	) {}

	@OnEvent('article.posted', { async: true })
	async handleArticlePosted(payload: {
		categoryId: number;
		categoryTitle: string;
		articleTitle: string;
	}) {
		await this.notificationsService.broadcastNotification(
			'New Article',
			`A new article titled "${payload.articleTitle}" has been posted in ${payload.categoryTitle}`,
		);
	}
}
