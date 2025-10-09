import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestUser, User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { CashoutService } from './cashout.service';
import { CashoutStatusQueryDto } from './dtos/cashout-status.dto';
import {
	CreateCashoutRequestDto,
	CreateCashoutResponseDto,
} from './dtos/create-cashout.dto';
import { GetCashoutResponseDto } from './dtos/get-cashout.dto';
import { PatchCashoutRequestDto } from './dtos/patch-cashout.dto';

@Controller('cashout')
export class CashoutController {
	constructor(private readonly cashoutService: CashoutService) {}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(CreateCashoutResponseDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Cashout request created successfully')
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(
		@Body() body: CreateCashoutRequestDto,
		@User() user: RequestUser,
	) {
		return await this.cashoutService.create(body, user.id);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetCashoutResponseDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER, Role.ADMIN)
	@ResponseMessage('Cashout request fetched successfully')
	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getOne(@Param('id') id: number, @User() user: RequestUser) {
		return await this.cashoutService.findOne(id, user.id);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetCashoutResponseDto, undefined, true),
		isArray: true,
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER, Role.ADMIN)
	@ResponseMessage('Cashout request fetched successfully')
	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll(
		@User() user: RequestUser,
		@Query() query: CashoutStatusQueryDto,
	) {
		return await this.cashoutService.findAll(query, user.id, user.role);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(CreateCashoutResponseDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@ResponseMessage('Cashout request updated successfully')
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async patchOne(
		@Param('id') id: number,
		@Body() body: PatchCashoutRequestDto,
	) {
		return await this.cashoutService.updateStatus(id, body.status, body.notes);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.SUBSCRIBER)
	@ResponseMessage('Cashout request deleted successfully')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async deleteOne(@Param('id') id: number, @User() user: RequestUser) {
		await this.cashoutService.deleteOne(id, user.id);

		return;
	}
}
