import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../guards/roles.guard';

export class RequestUser {
	id: string;
	email: string;
	role: Role;
}

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.user as RequestUser;
	},
);
