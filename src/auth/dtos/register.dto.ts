import Joi from 'joi';

export class RegisterRequestDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export const registerRequestSchema = Joi.object<RegisterRequestDto>({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});
