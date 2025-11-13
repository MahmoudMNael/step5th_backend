import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User, UserSubscription } from '@prisma/client';
import moment from 'moment';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionsEvents {
	constructor(
		private readonly subscriptionsService: SubscriptionsService,
		private readonly mailerService: MailerService,
	) {}

	@OnEvent('payment.processed', { async: true })
	async handlePaymentProcessedEvent(payload: {
		orderId: number;
		isSuccessful: boolean;
	}) {
		if (payload.isSuccessful) {
			this.subscriptionsService.handlePaymentSuccess(payload.orderId);
		} else {
			this.subscriptionsService.handlePaymentFailure(payload.orderId);
		}
	}

	@OnEvent('subscription.started', { async: true })
	async handleSubscriptionStartedEvent(payload: {
		user: User;
		userSubscription: UserSubscription;
	}) {
		const startDate = moment(payload.userSubscription.subscribedAt).format(
			'DD MMM YYYY',
		);
		const endDate = moment(payload.userSubscription.expireAt).format(
			'DD MMM YYYY',
		);

		this.mailerService.sendMail({
			to: payload.user.email,
			subject: '🎉 Subscription Activated!',
			text: `Congratulations ${payload.user.firstName || ''}! Your subscription is active from ${startDate} to ${endDate}. Enjoy our service!`,
			html: `
            <h2>Welcome, ${payload.user.firstName || 'User'}!</h2>
            <p>🎉 <b>Congratulations!</b> Your subscription has started.</p>
            <p><b>Start Date:</b> ${startDate}</p>
            <p><b>Expiry Date:</b> ${endDate}</p>
            <p>Thank you for choosing us. Enjoy all the benefits of your subscription!</p>
        `,
		});
	}
}
