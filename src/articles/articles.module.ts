import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ArticlesController } from './articles.controller';
import { ArticlesEvents } from './articles.events';
import { ArticlesService } from './articles.service';

@Module({
	controllers: [ArticlesController],
	providers: [ArticlesService, ArticlesEvents],
	imports: [FilesModule, NotificationsModule],
})
export class ArticlesModule {}
