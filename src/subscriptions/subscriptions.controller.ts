import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestUser, User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import {
	CreateSubscriptionRequestDto,
	CreateSubscriptionResponseDto,
} from './dtos/create-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(CreateSubscriptionResponseDto),
	})
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER)
	@Post('')
	async create(
		@Body() body: CreateSubscriptionRequestDto,
		@User() currentUser: RequestUser,
	) {
		return await this.subscriptionsService.initiateOrder(body, currentUser);
	}
}
