import { IsString } from 'class-validator';

export class CreateNotificationRequestDto {
	@IsString()
	token: string;
}
