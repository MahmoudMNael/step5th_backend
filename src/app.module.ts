import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { Language } from '@prisma/client';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CashoutModule } from './cashout/cashout.module';
import { CategoriesModule } from './categories/categories.module';
import { ConnectionsModule } from './connections/connections.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { PaymobModule } from './paymob/paymob.module';
import { PlansModule } from './plans/plans.module';
import { ReferralsModule } from './referrals/referrals.module';
import { NoOpLoader } from './shared/i18n/noop.loader';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';
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
			defaults: {
				from: `"Step5th" <${process.env.MAIL_USER}>`,
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
			],
		}),
		ScheduleModule.forRoot(),
		AuthModule,
		UsersModule,
		CategoriesModule,
		PlansModule,
		FilesModule,
		SubscriptionsModule,
		ArticlesModule,
		ReferralsModule,
		ConnectionsModule,
		PaymobModule,
		TasksModule,
		TransactionsModule,
		OrdersModule,
		CashoutModule,
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
