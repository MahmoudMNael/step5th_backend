import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from 'src/shared/decorators/response_message.decorator';
import { ApiBadResponses } from 'src/shared/swagger/api-bad-responses.decorator';
import { GenericResponseType } from 'src/shared/swagger/generic-response-type';
import { AuthService } from './auth.service';
import { RequestUser, User } from './decorators/user.decorator';
import {
	ConfirmRegisterRequestDto,
	ConfirmRegisterResponseDto,
} from './dtos/confirm-register.dto';
import { LoginRequestDto, LoginResponseDto } from './dtos/login.dto';
import { ProfileResponseDto } from './dtos/profile.dto';
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
}
