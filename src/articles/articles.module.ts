import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
	controllers: [ArticlesController],
	providers: [ArticlesService],
	imports: [FilesModule],
})
export class ArticlesModule {}
