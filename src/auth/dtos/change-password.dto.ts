import {
	IsEmail,
	IsString,
	IsStrongPassword,
	MinLength,
} from 'class-validator';

export class ChangePasswordRequestDto {
	@IsEmail()
	email: string;

	@IsString()
	oldPassword: string;

	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@MinLength(8)
	@IsString()
	newPassword: string;
}
