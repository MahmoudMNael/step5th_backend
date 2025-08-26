import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import prisma from '../shared/utils/prisma/client';

@Injectable()
export class FilesService {
	private uploadDirectory = join(__dirname, '..', '..', 'uploads');

	async uploadFile(file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('No file provided for upload');
		}
		const newFileName = `${Date.now()}__${file.originalname}`;
		const filePath = join(this.uploadDirectory, newFileName);

		try {
			const storedFilePath = await this.storeFile(file.buffer, filePath);
			const dbFile = await prisma.file.create({
				data: {
					name: file.originalname,
					mime: file.mimetype,
					path: join('uploads', newFileName),
				},
			});
			return dbFile;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	private async storeFile(buffer: Buffer, filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const stream = createWriteStream(filePath);
			stream.write(buffer);
			stream.end();
			stream.on('finish', () => resolve(filePath));
			stream.on('error', () => reject('Failed to write file to disk'));
		});
	}

	async getFileById(id: number) {
		const file = await prisma.file.findUnique({
			where: { id },
		});

		if (!file) {
			return null;
		}

		const absolutePath = join(process.cwd(), file.path);
		return {
			absolutePath,
			originalName: file.name,
			mime: file.mime,
		};
	}
}
