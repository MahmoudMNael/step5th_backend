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
			subject: 'Email Verification',
			text: `<strong>welcome, verification code: ${payload.verificationCode}</strong>`,
			html: `<strong>welcome, verification code: ${payload.verificationCode}</strong>`,
		});
	}

	@OnEvent('user.registeration-confirmed', { async: true })
	async handleUserRegistrationConfirmedEvent(payload: { email: string }) {
		this.mailerService.sendMail({
			to: payload.email,
			subject: 'Welcome Aboard',
			text: `<b>Welcome Aboard</b>`,
			html: `<b>Welcome Aboard</b>`,
		});
	}

	@OnEvent('user.forget-password', { async: true })
	async handleUserForgetPasswordEvent(payload: {
		email: string;
		verificationCode: string;
	}) {
		this.mailerService.sendMail({
			to: payload.email,
			subject: 'Password Reset Request',
			text: `<strong>Your password reset code is: ${payload.verificationCode}</strong>`,
			html: `<strong>Your password reset code is: ${payload.verificationCode}</strong>`,
		});
	}
}
