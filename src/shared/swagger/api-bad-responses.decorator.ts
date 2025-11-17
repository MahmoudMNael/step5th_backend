import { applyDecorators } from '@nestjs/common';
import {
	ApiBadGatewayResponse,
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiMethodNotAllowedResponse,
	ApiNotFoundResponse,
	ApiProperty,
	ApiUnauthorizedResponse,
	ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

type BadRequestResponse = {
	errorDescription?: string;
	statusCode: number;
	error?: string;
};

export function ApiBadResponses(data: BadRequestResponse[]) {
	return applyDecorators(
		...data.map(({ statusCode, error, errorDescription }) => {
			switch (statusCode) {
				case 400:
					return ApiBadRequestResponse({
						description: errorDescription ?? 'Bad Request',
						type: () => {
							class BadRequestResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return BadRequestResponse;
						},
					});
				case 401:
					return ApiUnauthorizedResponse({
						description:
							errorDescription ??
							'Unauthorized - usually user is not logged in',
						type: () => {
							class UnauthorizedResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return UnauthorizedResponse;
						},
					});
				case 403:
					return ApiForbiddenResponse({
						description:
							errorDescription ??
							'Forbidden - usually user is logged in but does not have permission to access the resource',
						type: () => {
							class ForbiddenResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return ForbiddenResponse;
						},
					});
				case 404:
					return ApiNotFoundResponse({
						description: errorDescription ?? 'Not Found',
						type: () => {
							class NotFoundResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return NotFoundResponse;
						},
					});

				case 405:
					return ApiMethodNotAllowedResponse({
						description: errorDescription ?? 'Method Not Allowed',
						type: () => {
							class MethodNotAllowedResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return MethodNotAllowedResponse;
						},
					});
				case 409:
					return ApiConflictResponse({
						description:
							errorDescription ??
							'Conflict - usually there is a conflict with the current state of the target resource',
						type: () => {
							class ConflictResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return ConflictResponse;
						},
					});
				case 415:
					return ApiUnsupportedMediaTypeResponse({
						description: errorDescription ?? 'Unsupported Media Type',
						type: () => {
							class UnsupportedMediaTypeResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return UnsupportedMediaTypeResponse;
						},
					});
				case 500:
					return ApiInternalServerErrorResponse({
						description: errorDescription ?? 'Internal Server Error',
						type: () => {
							class InternalServerErrorResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return InternalServerErrorResponse;
						},
					});
				default:
					return ApiBadGatewayResponse({
						description: errorDescription ?? 'Bad Gateway',
						type: () => {
							class BadGatewayResponse {
								@ApiProperty({ type: Number, example: statusCode })
								statusCode: number;
								@ApiProperty({ type: String, example: error })
								message: string;
							}
							return BadGatewayResponse;
						},
					});
			}
		}),
	);
}
