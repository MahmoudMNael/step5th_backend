import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Role, RolesGuard } from 'src/auth/guards/roles.guard';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { GenericResponseType } from 'src/shared/swagger/generic-response-type';
import { CreateReferralMetadataDto } from './dtos/create-referral-metadata.dto';
import { ReferralMetadataDto } from './dtos/get-referral-metadata.dto';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
	constructor(private readonly referralsService: ReferralsService) {}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(ReferralMetadataDto, undefined, false),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Metadata created successfully!')
	@HttpCode(HttpStatus.CREATED)
	@Post('metadata')
	async createReferralMetadata(
		@Body() createReferralMetadataDto: CreateReferralMetadataDto,
	) {
		return await this.referralsService.createReferralMetadata(
			createReferralMetadataDto,
		);
	}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(ReferralMetadataDto, undefined, false),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Metadata retrieved successfully!')
	@HttpCode(HttpStatus.OK)
	@Get('metadata')
	async getReferralMetadata() {
		const metadata = await this.referralsService.getReferralMetadata();
		return metadata;
	}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(ReferralMetadataDto, undefined, false),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Metadata updated successfully!')
	@HttpCode(HttpStatus.OK)
	@Put('metadata')
	async updateReferralMetadata(
		@Body() updateReferralMetadataDto: CreateReferralMetadataDto,
	) {
		return await this.referralsService.updateReferralMetadata(
			updateReferralMetadataDto,
		);
	}
}
