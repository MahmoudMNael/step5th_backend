import {
	IsEmail,
	IsString,
	IsStrongPassword,
	MinLength,
} from 'class-validator';

export class RegisterRequestDto {
	@MinLength(2)
	@IsString()
	firstName: string;

	@MinLength(2)
	@IsString()
	lastName: string;

	@IsEmail()
	@IsString()
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
