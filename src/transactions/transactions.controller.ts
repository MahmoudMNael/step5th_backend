import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { Pagination } from '../shared/models/generic-response.model';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { CreateTransactionRequestDto } from './dtos/create-transaction.dto';
import { GetTransactionResponseDto } from './dtos/get-transaction.dto';
import { GetTransactionsQueryParamsDto } from './dtos/get-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(GetTransactionResponseDto, Pagination, true),
	})
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Get('')
	async getManyTransactions(@Query() queries: GetTransactionsQueryParamsDto) {
		return await this.transactionsService.findMany(
			{ recipientId: queries.recipientId, orderId: queries.orderId },
			{ page: queries.page, limit: queries.limit },
		);
	}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(GetTransactionResponseDto, undefined, false),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@Post(':userId')
	async create(
		@Param('userId') userId: string,
		@Body() body: CreateTransactionRequestDto,
	) {
		return await this.transactionsService.create(
			{
				amount: body.amount,
				Recipient: {
					connect: { id: userId },
				},
				type: body.type,
			},
			userId,
		);
	}
}
