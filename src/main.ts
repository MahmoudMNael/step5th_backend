import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiProperty, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'log', 'debug', 'verbose'],
	});

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	const port = process.env.PORT ?? 3000;

	const config = new DocumentBuilder()
		.setTitle('Step 5th API')
		.setDescription('The API Documentation for Step 5th.')
		.setVersion('1.0')
		.addServer(`http://localhost:${port}`)
		.addServer(`https://step5th.com/api`)
		.addServer(`http://31.97.156.169:4000`)
		.addBearerAuth()
		.addSecurityRequirements('bearer')
		.addGlobalParameters({
			name: 'Accept-Language',
			required: true,
			schema: {
				type: 'string',
				enum: Object.values(Language),
				example: Language.en,
			},
			in: 'header',
		})
		.addGlobalResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Bad Request - invalid form input',
			type: () => {
				class BadRequestResponse {
					@ApiProperty({ example: 400 })
					statusCode: number;
					@ApiProperty()
					message: string;
				}
				return BadRequestResponse;
			},
		})
		.build();

	const document = SwaggerModule.createDocument(app, config);

	for (const pathKey in document.paths) {
		const pathItem = document.paths[pathKey];
		for (const methodKey in pathItem) {
			const operation = pathItem[methodKey];

			const requestBody = operation.requestBody;

			if (requestBody?.content) {
				// Add additional content types only if not present
				const content = requestBody.content;

				if (!content['application/json']) {
					content['application/json'] =
						content['application/x-www-form-urlencoded'];
				}

				if (!content['application/x-www-form-urlencoded']) {
					content['application/x-www-form-urlencoded'] =
						content['application/json'];
				}
			} else {
				// If no requestBody is defined at all, define one with empty content types
				operation.requestBody = {
					content: {
						'application/json': {},
						'application/x-www-form-urlencoded': {},
					},
				};
			}
		}
	}

	SwaggerModule.setup('swagger', app, document, {
		jsonDocumentUrl: 'swagger/json',
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
		},
	});

	await app.listen(port);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
