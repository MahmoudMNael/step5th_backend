import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { catchError, map, throwError } from 'rxjs';
import { PaymentDataDto } from './dtos/order-data.dto';

@Injectable()
export class PaymobService {
	constructor(
		private readonly httpService: HttpService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async initiateOrder(
		orderData: PaymentDataDto,
		isAnnual: boolean,
	): Promise<{ paymentUrl: string; orderId: number; amountCents: number }> {
		const paymentIntegerations = JSON.parse(
			process.env.PAYMOB_PAYMENT_INTEGERATION!,
		) as number[];

		return new Promise((resolve, reject) => {
			this.httpService
				.post(
					`${process.env.PAYMOB_BASE_URL!}/v1/intention`,
					{
						amount: orderData.priceCents,
						currency: 'EGP',
						payment_methods: paymentIntegerations,
						items: [
							{
								name: orderData.productName,
								amount: orderData.priceCents,
								description: `1 ${isAnnual ? 'year' : 'month'} of subscription.`,
								quantity: 1,
							},
						],
						billing_data: {
							first_name: orderData.firstName,
							last_name: orderData.lastName,
							email: orderData.email,
							phone_number: orderData.phoneNumber ?? '+201010101010',
						},
						customer: {
							user_id: orderData.userId,
							first_name: orderData.firstName,
							last_name: orderData.lastName,
							email: orderData.email,
							phone_number: orderData.phoneNumber ?? '+201010101010',
						},
					},
					{
						headers: {
							Authorization: `Token ${process.env.PAYMOB_SECRET_KEY!}`,
						},
					},
				)
				.pipe(
					map((response) => {
						if (response.status === HttpStatus.CREATED) {
							resolve({
								paymentUrl: `${process.env.PAYMOB_BASE_URL!}/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY!}&clientSecret=${response.data.client_secret}`,
								orderId: response.data.intention_order_id,
								amountCents: response.data.intention_detail.amount,
							});
						} else {
							reject(
								new HttpException(
									'Paymob: Failed to create intention',
									response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
								),
							);
						}
					}),
					catchError((error) => {
						reject(
							new HttpException(
								error.response.data || 'Paymob: Request failed!',
								error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
							),
						);
						return throwError(() => error);
					}),
				)
				.subscribe();
		});
	}

	async handleCallback(body: any) {
		let orderId = body.obj.order.id;
		let isSuccessful = body.obj.success;

		this.eventEmitter.emit('payment.processed', { orderId, isSuccessful });

		return;
	}
}
