import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Transaction } from '@prisma/client';
import prisma from '../shared/utils/prisma/client';

@Injectable()
export class TransactionsEvents {
	constructor(private readonly mailerService: MailerService) {}

	@OnEvent('transaction.created', { async: true })
	async handleTransactionCreationEvent(payload: { transaction: Transaction }) {
		const user = await prisma.user.findUnique({
			where: { id: payload.transaction.recipientId! },
		});

		this.mailerService.sendMail({
			to: user!.email,
			subject: '💸 You Received a New Transaction!',
			text: `Hello ${user!.firstName || ''},\n\nYou have received ${payload.transaction.amount} EGP in your system wallet. You can now use this balance for your activities on our platform.\n\nThank you for being with us!`,
			html: `
            <h2>Hello, ${user!.firstName || 'User'}!</h2>
            <p>💸 <b>Good news!</b> You have received <b>${payload.transaction.amount} EGP</b> in your system wallet.</p>
            <p>You can now use this balance for your activities on our platform.</p>
            <p>Thank you for being with us!</p>
        `,
		});
	}
}
