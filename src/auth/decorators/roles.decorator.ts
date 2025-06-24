import { SetMetadata } from '@nestjs/common';

enum Role {
	USER = 'USER',
	ADMIN = 'ADMIN',
	SUBSCRIBER = 'SUBSCRIBER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
