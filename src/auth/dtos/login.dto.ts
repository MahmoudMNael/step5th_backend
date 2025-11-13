import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
	@IsEmail()
	@IsString()
	email: string;

	@MinLength(8)
	@IsString()
	password: string;
}

export class LoginResponseDto {
	accessToken: string;
}
