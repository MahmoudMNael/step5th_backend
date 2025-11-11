import { Injectable } from '@nestjs/common';
import prisma from '../shared/utils/prisma/client';

@Injectable()
export class UserTokensService {
	async registerToken(userId: string, fcmToken: string) {
		const existingToken = await prisma.deviceToken.findUnique({
			where: { token: fcmToken },
		});

		if (existingToken) {
			return;
		}

		return await prisma.deviceToken.create({
			data: {
				userId,
				token: fcmToken,
			},
		});
	}

	async removeToken(fcmToken: string) {
		return await prisma.deviceToken.deleteMany({
			where: { token: fcmToken },
		});
	}

	async getUserTokens(userId: string) {
		const tokens = await prisma.deviceToken.findMany({
			where: { userId },
			select: { token: true },
		});

		return tokens.map((t) => t.token);
	}

	async getUsersTokens(userIds: string[]) {
		const tokens = await prisma.deviceToken.findMany({
			where: { userId: { in: userIds } },
			select: { token: true },
		});

		return tokens.map((t) => t.token);
	}

	async removeInvalidTokens(invalidTokens: string[]) {
		return await prisma.deviceToken.deleteMany({
			where: {
				token: { in: invalidTokens },
			},
		});
	}
}
