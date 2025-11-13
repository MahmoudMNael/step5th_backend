import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications/notifications.service';
import { UserTokensService } from '../notifications/user-tokens.service';
import prisma from '../shared/utils/prisma/client';

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
		const subscribers = await prisma.categoryNotificationsSubscriber.findMany({
			where: { categoryId: payload.categoryId },
			select: { userId: true },
		});
		const userIds = subscribers.map((s) => s.userId);

		await this.notificationsService.pushNotification(
			userIds,
			'New Article',
			`A new article titled "${payload.articleTitle}" has been posted in ${payload.categoryTitle}`,
		);
	}
}
