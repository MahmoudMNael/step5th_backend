import Joi from 'joi';

export class ConfirmRegisterRequestDto {
	email: string;
	verificationCode: string;
}

export const confirmRegisterRequestSchema =
	Joi.object<ConfirmRegisterRequestDto>({
		email: Joi.string().email().required(),
		verificationCode: Joi.string().length(6).required(),
	});

export class ConfirmRegisterResponseDto {
	accessToken: string;
}

export const confirmRegisterResponseDtoSchema =
	Joi.object<ConfirmRegisterResponseDto>({
		accessToken: Joi.string().required(),
	});
