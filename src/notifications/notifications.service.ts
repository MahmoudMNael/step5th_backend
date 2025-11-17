import { Injectable } from '@nestjs/common';
import { firebaseAdmin } from '../firebase-admin.config';
import { UserTokensService } from './user-tokens.service';

@Injectable()
export class NotificationsService {
	constructor(private readonly tokenService: UserTokensService) {}

	async broadcastNotification(
		title: string,
		body: string,
		data?: Record<string, any>,
	) {
		const userTokens = await this.tokenService.getAllTokens();

		if (!userTokens || userTokens.length === 0) {
			return;
		}

		const batchSize = 500;
		const batches: string[][] = [];

		// Split tokens into batches of 500 (FCM limit)
		for (let i = 0; i < userTokens.length; i += batchSize) {
			batches.push(userTokens.slice(i, i + batchSize));
		}

		let totalSuccess = 0;
		let totalFailed = 0;
		const invalidTokens: string[] = [];
		const retryableTokens: string[] = [];

		for (const tokenBatch of batches) {
			const message = {
				notification: { title, body },
				data,
				tokens: tokenBatch,
			};

			try {
				const response = await firebaseAdmin
					.messaging()
					.sendEachForMulticast(message);

				totalSuccess += response.successCount;
				totalFailed += response.failureCount;

				response.responses.forEach((res, idx) => {
					if (!res.success && res.error) {
						const code = res.error.code;
						const token = tokenBatch[idx];

						if (
							code === 'messaging/invalid-recipient' ||
							code === 'messaging/invalid-registration-token' ||
							code === 'messaging/registration-token-not-registered'
						) {
							invalidTokens.push(token);
						} else {
							retryableTokens.push(token);
						}
					}
				});
			} catch (err) {
				console.error('Error sending notification batch:', err);
			}
		}

		if (invalidTokens.length > 0) {
			await this.tokenService.removeInvalidTokens(invalidTokens);
		}

		if (retryableTokens.length > 0) {
			await this.retrySend(retryableTokens, title, body, data);
		}

		return {
			success: totalSuccess,
			failed: totalFailed,
			removed: invalidTokens.length,
			retried: retryableTokens.length,
		};
	}

	async pushNotification(
		userIds: string[],
		title: string,
		body: string,
		data?: Record<string, any>,
	) {
		const userTokens = await this.tokenService.getUsersTokens(userIds);

		if (!userTokens || userTokens.length === 0) {
			return;
		}

		const batchSize = 500;
		const batches: string[][] = [];

		// Split tokens into batches of 500 (FCM limit)
		for (let i = 0; i < userTokens.length; i += batchSize) {
			batches.push(userTokens.slice(i, i + batchSize));
		}

		let totalSuccess = 0;
		let totalFailed = 0;
		const invalidTokens: string[] = [];
		const retryableTokens: string[] = [];

		for (const tokenBatch of batches) {
			const message = {
				notification: { title, body },
				data,
				tokens: tokenBatch,
			};

			try {
				const response = await firebaseAdmin
					.messaging()
					.sendEachForMulticast(message);

				totalSuccess += response.successCount;
				totalFailed += response.failureCount;

				response.responses.forEach((res, idx) => {
					if (!res.success && res.error) {
						const code = res.error.code;
						const token = tokenBatch[idx];

						if (
							code === 'messaging/invalid-recipient' ||
							code === 'messaging/invalid-registration-token' ||
							code === 'messaging/registration-token-not-registered'
						) {
							invalidTokens.push(token);
						} else {
							retryableTokens.push(token);
						}
					}
				});
			} catch (err) {
				console.error('Error sending notification batch:', err);
			}
		}

		if (invalidTokens.length > 0) {
			await this.tokenService.removeInvalidTokens(invalidTokens);
		}

		if (retryableTokens.length > 0) {
			await this.retrySend(retryableTokens, title, body, data);
		}

		return {
			success: totalSuccess,
			failed: totalFailed,
			removed: invalidTokens.length,
			retried: retryableTokens.length,
		};
	}

	private async retrySend(
		tokens: string[],
		title: string,
		body: string,
		data?: Record<string, any>,
		attempt = 1,
	) {
		const delay = Math.min(2000 * attempt, 10000);
		await new Promise((resolve) => setTimeout(resolve, delay));

		try {
			const response = await firebaseAdmin.messaging().sendEachForMulticast({
				notification: { title, body },
				data,
				tokens,
			});

			// If still failing, retry up to 3 attempts
			const stillFailedTokens = response.responses
				.map((r, i) => (!r.success ? tokens[i] : null))
				.filter(Boolean) as string[];

			if (stillFailedTokens.length > 0 && attempt < 3) {
				await this.retrySend(stillFailedTokens, title, body, data, attempt + 1);
			}
		} catch (err) {
			if (attempt < 3) {
				await this.retrySend(tokens, title, body, data, attempt + 1);
			}
		}
	}
}
