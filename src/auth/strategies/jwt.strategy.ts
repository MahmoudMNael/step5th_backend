import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import prisma from '../../shared/utils/prisma/client';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
		});
	}

	async validate(payload) {
		const user = await prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true, email: true, role: true },
		});

		return {
			id: user!.id,
			email: user!.email,
			role: user!.role,
		};
	}
}
