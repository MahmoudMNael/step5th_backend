import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('images/:id')
	async getOneFile(@Param('id') id: number, @Res() res: Response) {
		const fileRecord = await this.filesService.getFileById(id);
		if (!fileRecord) {
			throw new NotFoundException('File not found');
		}
		return res.download(fileRecord.absolutePath, fileRecord.originalName);
	}
}
