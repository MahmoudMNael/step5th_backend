import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import prisma from 'src/shared/utils/prisma/client';
import { CreateReferralMetadataDto } from './dtos/create-referral-metadata.dto';

@Injectable()
export class ReferralsService {
	async updateReferralMetadata(data: CreateReferralMetadataDto) {
		const metadata = await prisma.refferalMetaData.update({
			where: { id: 1 },
			data,
			select: {
				numberOfLevels: true,
				firstLevelPercentage: true,
				midLevelsPercentage: true,
				lastLevelPercentage: true,
				updatedAt: true,
			},
		});
		return metadata;
	}

	async getReferralMetadata() {
		const metadata = await prisma.refferalMetaData.findFirst({
			select: {
				numberOfLevels: true,
				firstLevelPercentage: true,
				midLevelsPercentage: true,
				lastLevelPercentage: true,
				updatedAt: true,
			},
		});

		if (!metadata) {
			throw new NotFoundException('Referral metadata not found.');
		}

		return metadata;
	}

	async createReferralMetadata(data: CreateReferralMetadataDto) {
		if ((await prisma.refferalMetaData.count()) > 0) {
			throw new ConflictException(
				'Referral metadata already exists. Only one metadata can be created.',
			);
		}

		const metadata = await prisma.refferalMetaData.create({
			data,
			select: {
				numberOfLevels: true,
				firstLevelPercentage: true,
				midLevelsPercentage: true,
				lastLevelPercentage: true,
				updatedAt: true,
			},
		});

		return metadata;
	}
}
