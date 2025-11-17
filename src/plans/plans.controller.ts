import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { ResponseMessage } from '../shared/decorators/response_message.decorator';
import { GenericResponseType } from '../shared/swagger/generic-response-type';
import { CreatePlanRequestDto } from './dtos/create-plan.dto';
import { PlanDto } from './dtos/plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
	constructor(private readonly plansService: PlansService) {}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(PlanDto, undefined, true),
		isArray: true,
	})
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Plans retrieved successfully!')
	@Get('')
	getAll() {
		return this.plansService.findAll();
	}

	@ApiResponse({
		status: HttpStatus.CREATED,
		type: GenericResponseType(PlanDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('Plan created successfully!')
	@Post('')
	async create(
		@Body() body: CreatePlanRequestDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const plan = await this.plansService.create(body);
		res.setHeader('Location', `/plans/${plan.id}`);
		return plan;
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(PlanDto),
	})
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Plan retrieved successfully!')
	@Get(':planId')
	async getOne(@Param('planId') planId: number) {
		return await this.plansService.findOne(planId);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		type: GenericResponseType(PlanDto),
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Plan updated successfully!')
	@Put(':planId')
	async update(
		@Param('planId') planId: number,
		@Body() body: CreatePlanRequestDto,
	) {
		return await this.plansService.update(planId, body);
	}

	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ResponseMessage('Plan delete successfully!')
	@Delete(':planId')
	async delete(@Param('planId') planId: number) {
		return await this.plansService.delete(planId);
	}
}
