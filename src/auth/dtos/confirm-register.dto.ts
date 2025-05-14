import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmRegisterRequestDto {
	@IsEmail()
	@IsString()
	email: string;

	@Length(6, 6)
	@IsString()
	verificationCode: string;
}

export class ConfirmRegisterResponseDto {
	accessToken: string;
}
