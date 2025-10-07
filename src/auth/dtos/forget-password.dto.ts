import {
	IsEmail,
	IsString,
	IsStrongPassword,
	Length,
	MinLength,
} from 'class-validator';

export class ForgetPasswordRequestDto {
	@IsEmail()
	email: string;
}

export class VerifyForgetPasswordRequestDto {
	@IsEmail()
	email: string;

	@IsString()
	@Length(6, 6)
	verificationCode: string;
}

export class ChangeForgottenPasswordRequestDto {
	@IsEmail()
	email: string;

	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@MinLength(8)
	@IsString()
	password: string;
}
