import { IsNumber } from 'class-validator';

export class CreateReferralMetadataDto {
	@IsNumber()
	numberOfLevels: number;

	@IsNumber()
	firstLevelPercentage: number;

	@IsNumber()
	midLevelsPercentage: number;

	@IsNumber()
	lastLevelPercentage: number;
}
