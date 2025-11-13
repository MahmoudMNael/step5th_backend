import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { RequestUser, User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateNotificationRequestDto } from './dtos/create-notification.dto';
import { NotificationsService } from './notifications.service';
import { UserTokensService } from './user-tokens.service';

@Controller('notifications')
export class NotificationsController {
	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly userTokensService: UserTokensService,
	) {}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('token')
	async addToken(
		@Body() body: CreateNotificationRequestDto,
		@User() user: RequestUser,
	) {
		await this.userTokensService.registerToken(user.id, body.token);
	}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('token')
	async removeToken(@Body() body: CreateNotificationRequestDto) {
		await this.userTokensService.removeToken(body.token);
	}
}
