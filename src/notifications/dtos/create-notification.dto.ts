import { IsString, MinLength } from 'class-validator';

export class CreateNotificationRequestDto {
	@IsString()
	token: string;
}

export class BroadcastNotificationRequestDto {
	@MinLength(2)
	@IsString()
	title: string;

	@MinLength(2)
	@IsString()
	body: string;
}
