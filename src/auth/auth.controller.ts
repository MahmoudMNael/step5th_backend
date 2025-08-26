import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { ApiBadResponses } from '../shared/swagger/api-bad-responses.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { AuthService } from './auth.service';
import { RequestUser, User } from './decorators/user.decorator';
import { ChangePasswordRequestDto } from './dtos/change-password.dto';
import {
	ConfirmRegisterRequestDto,
	ConfirmRegisterResponseDto,
} from './dtos/confirm-register.dto';
import {
	ChangeForgottenPasswordRequestDto,
	ForgetPasswordRequestDto,
	VerifyForgetPasswordRequestDto,
} from './dtos/forget-password.dto';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';
import {
	ProfileResponseDto,
	UpdateProfileRequestDto,
} from './dtos/profile.dto';
import { RegisterRequestDto } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@ApiBadResponses([
		{
			statusCode: HttpStatus.NOT_FOUND,
			errorDescription: 'Not Found - expired verification code',
		},
		{
			statusCode: HttpStatus.CONFLICT,
			errorDescription:
				'Conflict - user with that email already exists || Conflict - user already registered! Awaiting email confirmation.',
		},
	])
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('User registered successfully! Awaiting email confirmation.')
	@Post('register')
	async register(@Body() body: RegisterRequestDto) {
		body.email = body.email.toLowerCase();
		await this.authService.register(body);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(ConfirmRegisterResponseDto),
	})
	@ApiBadResponses([
		{
			statusCode: HttpStatus.NOT_FOUND,
			errorDescription: 'Not Found - expired verification code',
		},
		{
			statusCode: HttpStatus.UNAUTHORIZED,
			errorDescription: 'Unauthorized - invalid verification code',
		},
	])
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('User confirmed successfully!')
	@Post('confirm-register')
	async confirmRegister(
		@Body()
		body: ConfirmRegisterRequestDto,
	) {
		return await this.authService.confirmRegistration(body);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(LoginResponseDto),
	})
	@ApiBadResponses([
		{
			statusCode: HttpStatus.NOT_FOUND,
			errorDescription:
				'Not Found - there is no user registered with this email || Not Found - email is not confirmed',
		},
		{
			statusCode: HttpStatus.UNAUTHORIZED,
			errorDescription: 'Unauthorized - invalid password',
		},
	])
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('User logged in successfully!')
	@Post('login')
	async login(@Body() body: LoginRequestDto) {
		body.email = body.email.toLowerCase();
		return await this.authService.login(body);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(ProfileResponseDto),
	})
	@ApiBadResponses([{ statusCode: HttpStatus.UNAUTHORIZED }])
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ResponseMessage('User retrieved successfully!')
	@Get('profile')
	async getProfile(@User() currentUser: RequestUser) {
		return this.authService.getProfile(currentUser.id);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(ProfileResponseDto),
	})
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ResponseMessage('User updated successfully!')
	@Patch('profile')
	async updateProfile(
		@User() currentUser: RequestUser,
		@Body() body: UpdateProfileRequestDto,
	) {
		return await this.authService.updateProfile(currentUser.id, body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Password reset request sent successfully!')
	@Post('request-forget-password')
	async forgetPassword(@Body() body: ForgetPasswordRequestDto) {
		body.email = body.email.toLowerCase();

		await this.authService.requestPasswordReset(body.email);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Password reset request verified successfully!')
	@Post('verify-forget-password')
	async verifyForgetPassword(@Body() body: VerifyForgetPasswordRequestDto) {
		body.email = body.email.toLowerCase();

		await this.authService.confirmPasswordReset(
			body.email,
			body.verificationCode,
		);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Password has changed successfully!')
	@Patch('change-forget-password')
	async changeForgottenPassword(
		@Body() body: ChangeForgottenPasswordRequestDto,
	) {
		body.email = body.email.toLowerCase();

		await this.authService.changeForgottenPassword(body.email, body.password);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Password has changed successfully!')
	@Patch('change-password')
	async changePassword(@Body() body: ChangePasswordRequestDto) {
		body.email = body.email.toLowerCase();

		await this.authService.changePassword(
			body.email,
			body.oldPassword,
			body.newPassword,
		);
	}
}
