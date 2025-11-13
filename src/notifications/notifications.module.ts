import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UserTokensService } from './user-tokens.service';

@Module({
	controllers: [NotificationsController],
	providers: [NotificationsService, UserTokensService],
	exports: [NotificationsService, UserTokensService],
})
export class NotificationsModule {}
