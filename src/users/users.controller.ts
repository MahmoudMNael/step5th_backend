import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { Pagination } from '../shared/models/generic-response.model';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { GetUsersResponseDto } from './dtos/get-users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetUsersResponseDto, Pagination, true),
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('')
	async getManyUsers(@Query() queries: GetUsersQueryDto) {
		return await this.usersService.findMany(
			{ userId: queries.userId },
			{ page: queries.page, limit: queries.limit },
		);
	}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':userId')
	async delete(@Param('userId') userId: string) {
		this.usersService.delete(userId);
	}
}
