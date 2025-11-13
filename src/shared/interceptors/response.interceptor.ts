import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { GenericResponse, Pagination } from '../models/generic-response.model';

@Injectable()
export class ResponseInterceptor<T>
	implements NestInterceptor<T, GenericResponse<T>>
{
	constructor(private reflector: Reflector) {}
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<GenericResponse<T>> {
		return next.handle().pipe(
			map((data) => {
				let responseData = data;
				let pagination: Pagination | undefined;

				if (data?.pagination) {
					const { pagination: pag, ...rest } = data;
					pagination = pag;

					// Check if `rest` has exactly one key and that key contains an array
					const keys = Object.keys(rest);
					if (keys.length === 1 && Array.isArray(rest[keys[0]])) {
						responseData = rest[keys[0]]; // Extract the array directly
					} else {
						responseData = rest; // Otherwise, keep the remaining object
					}
				}

				return {
					message:
						this.reflector.get<string>(
							'status_message',
							context.getHandler(),
						) ?? 'Success!',
					pagination,
					data: responseData,
				};
			}),
		);
	}
}
