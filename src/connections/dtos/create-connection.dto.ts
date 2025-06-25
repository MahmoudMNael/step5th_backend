import { IsString, Length } from 'class-validator';

export class CreateConnectionRequestDto {
	@Length(8, 8)
	@IsString()
	inviteCode: string;
}
