import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AuthEvents {
	constructor(private readonly mailerService: MailerService) {}

	@OnEvent('user.registered', { async: true })
	async handleUserRegisteredEvent(payload: {
		email: string;
		verificationCode: string;
	}) {
		this.mailerService.sendMail({
			to: payload.email,
			subject: 'Testing Nest MailerModule',
			text: `<strong>welcome, verification code: ${payload.verificationCode}</strong>`,
			html: `<strong>welcome, verification code: ${payload.verificationCode}</strong>`,
		});
	}

	@OnEvent('user.registeration-confirmed', { async: true })
	async handleUserRegistrationConfirmedEvent(payload: { email: string }) {
		this.mailerService.sendMail({
			to: payload.email,
			subject: 'Testing Nest MailerModule',
			text: `<b>Welcome Aboard</b>`,
			html: `<b>Welcome Aboard</b>`,
		});
	}
}
