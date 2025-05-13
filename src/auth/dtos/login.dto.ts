import Joi from 'joi';

export class LoginRequestDto {
	email: string;
	password: string;
}

export const loginRequestDtoSchema = Joi.object<LoginRequestDto>({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

export class LoginResponseDto {
	accessToken: string;
}

export const loginResponseDtoSchema = Joi.object<LoginResponseDto>({
	accessToken: Joi.string().required(),
});
