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
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestUser, User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { ConnectionsService } from './connections.service';
import { CreateConnectionRequestDto } from './dtos/create-connection.dto';
import { GetCodeDto } from './dtos/get-code.dto';
import {
	GetConnectionDto,
	GetParentConnectionDto,
} from './dtos/get-connections.dto';

@Controller('connections')
export class ConnectionsController {
	constructor(private readonly connectionsService: ConnectionsService) {}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetCodeDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Invite code generated successfully!')
	@HttpCode(HttpStatus.OK)
	@Get('get-code')
	async getCode(@User() currentUser: RequestUser): Promise<GetCodeDto> {
		const code = await this.connectionsService.createInviteCode(currentUser.id);

		return {
			inviteCode: code,
		};
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Connection added successfully!')
	@HttpCode(HttpStatus.OK)
	@Post('')
	async addConnection(
		@Body() body: CreateConnectionRequestDto,
		@User() currentUser: RequestUser,
	): Promise<void> {
		await this.connectionsService.addConnection(body, currentUser);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetConnectionDto, undefined, true),
		isArray: true,
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Connections retrieved successfully!')
	@HttpCode(HttpStatus.OK)
	@Get('')
	async getConnections(
		@User() currentUser: RequestUser,
	): Promise<GetConnectionDto[]> {
		const connections = await this.connectionsService.getAllConnections(
			currentUser.id,
		);

		return connections;
	}

	// @ApiResponse({
	// 	status: HttpStatus.NO_CONTENT,
	// })
	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @Roles(Role.USER, Role.SUBSCRIBER)
	// @ResponseMessage('Connection removed successfully!')
	// @HttpCode(HttpStatus.NO_CONTENT)
	// @Delete(':childId')
	// async deleteConnection(
	// 	@Param('childId') childId: string,
	// 	@User() currentUser: RequestUser,
	// ) {
	// 	await this.connectionsService.deleteConnection(currentUser.id, childId);
	// }

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetParentConnectionDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Parent retrieved successfully!')
	@HttpCode(HttpStatus.OK)
	@Get('parent')
	async getParentConnection(@User() currentUser: RequestUser) {
		const parent = await this.connectionsService.getParentConnection(
			currentUser.id,
		);

		return parent;
	}
}
