import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { RequestUser } from '../auth/decorators/user.decorator';
import prisma from '../shared/utils/prisma/client';
import { CreateConnectionRequestDto } from './dtos/create-connection.dto';

@Injectable()
export class ConnectionsService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	private generateInviteCode(length: number = 8) {
		const nanoid = customAlphabet(
			'abcdefghijklmnopqrstuvwxyz0123456789',
			length,
		);

		return nanoid();
	}

	private async generateUniqueCode() {
		let attempts = 0;

		while (attempts < 999) {
			const code = this.generateInviteCode();
			const exists = await this.cacheManager.get(`invite:${code}`);
			if (!exists) return code;
			attempts++;
		}

		throw new InternalServerErrorException(
			'Failed to generate a unique invite code after multiple attempts.',
		);
	}

	async createInviteCode(userId: string) {
		const userParent = await prisma.user.findUnique({
			where: { id: userId },
			select: { parentConnectionId: true },
		});

		if (userParent?.parentConnectionId) {
			throw new ConflictException(
				'User already has a parent connection. Cannot create another invite code.',
			);
		}

		const code = await this.generateUniqueCode();
		await this.cacheManager.set(`invite:${code}`, userId, 24 * 60 * 60 * 1000);
		return code;
	}

	private async validateInviteCodeAndReturn(code: string) {
		const userId = await this.cacheManager.get<string>(`invite:${code}`);
		if (!userId) {
			throw new NotFoundException('Invalid or expired invite code.');
		}

		await this.cacheManager.del(`invite:${code}`);
		return userId;
	}

	private async checkUserConnectionsVacancy(userId: string) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				role: true,
				_count: {
					select: {
						ChildrenConnections: true,
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundException('User not found.');
		}

		const maxConnections = user.role == 'USER' ? 5 : 7;

		if (user._count.ChildrenConnections >= maxConnections) {
			return false;
		}
		return true;
	}

	async addConnection(
		body: CreateConnectionRequestDto,
		currentUser: RequestUser,
	) {
		const available = await this.checkUserConnectionsVacancy(currentUser.id);

		if (!available) {
			throw new ConflictException(
				`User has reached the maximum number of connections.`,
			);
		}

		const childId = await this.validateInviteCodeAndReturn(body.inviteCode);

		Logger.log(`User ${currentUser.id} is adding connection to ${childId}`);

		const parent = await prisma.user.findUnique({
			where: { id: currentUser.id },
		});

		if (parent!.parentConnectionId == childId) {
			throw new ConflictException(
				`User can't add their parent as a connection.`,
			);
		}

		if (parent!.id == childId) {
			throw new ConflictException(`User can't add themselves as a connection.`);
		}

		prisma.user
			.update({
				where: { id: childId },
				data: {
					parentConnectionId: currentUser.id,
				},
			})
			.catch((error) => {
				Logger.error(
					`Failed to add connection from ${currentUser.id} to ${childId}: ${error.message}`,
				);
			});

		this.cacheManager.del(`invite:${body.inviteCode}`);
	}

	async deleteConnection(parentId: string, childId: string) {
		const child = await prisma.user.findUnique({
			where: { id: childId },
		});

		if (!child) {
			throw new NotFoundException('Child user not found.');
		}

		if (child.parentConnectionId !== parentId) {
			throw new ConflictException(
				'This child is not connected to the current user.',
			);
		}

		await prisma.user.update({
			where: { id: childId },
			data: {
				parentConnectionId: null,
			},
		});
	}

	async getAllConnections(userId: string) {
		const connections = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				ChildrenConnections: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						phoneNumber: true,
						role: true,
						UserWallets: {
							select: {
								balance: true,
							},
						},
						ChildrenConnections: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
								email: true,
								phoneNumber: true,
								role: true,
							},
						},
					},
				},
			},
		});

		if (!connections) {
			throw new NotFoundException('User not found');
		}

		return connections.ChildrenConnections;
	}

	async getParentConnection(userId: string) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				ParentConnection: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						phoneNumber: true,
						role: true,
					},
				},
			},
		});

		if (!user || !user.ParentConnection) {
			throw new NotFoundException('User not found');
		}

		return user.ParentConnection;
	}
}
