import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Language } from '@prisma/client';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { NoOpLoader } from './shared/i18n/noop.loader';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.register({ isGlobal: true }),
		EventEmitterModule.forRoot(),
		MailerModule.forRoot({
			transport: {
				host: process.env.MAIL_HOST,
				port: Number(process.env.MAIL_PORT),
				secure: false,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASS,
				},
			},
			template: {
				dir: '../templates',
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
		I18nModule.forRoot({
			fallbackLanguage: Language.en,
			loader: NoOpLoader,
			loaderOptions: {
				path: '',
			},
			resolvers: [
				{
					use: AcceptLanguageResolver,
					options: {
						matchType: 'strict',
						validator: (lang: string) => {
							return Object.values(Language).includes(lang as Language);
						},
					},
				},
				{
					use: QueryResolver,
					options: {
						value: ['lang'],
						validator: (lang: string) => {
							return Object.values(Language).includes(lang as Language);
						},
					},
				},
			],
		}),
		AuthModule,
		UsersModule,
		CategoriesModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
})
export class AppModule {}
