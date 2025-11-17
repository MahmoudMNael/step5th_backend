import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const genericResponseCache = new Map<string, Type<any>>();

export function GenericResponseType<
	TModel extends Type<any>,
	TPagination extends Type<any>,
>(model?: TModel, inputPagination?: TPagination, isArray = false) {
	const cacheKey = [
		model?.name || 'void',
		inputPagination?.name || 'void',
		isArray ? 'array' : 'single',
	].join('_');

	if (genericResponseCache.has(cacheKey)) {
		return genericResponseCache.get(cacheKey);
	}

	class ResponseClass {
		@ApiProperty()
		message: string;

		@ApiProperty({ required: false, type: model, isArray })
		data: TModel;

		@ApiProperty({ required: false, type: inputPagination })
		pagination?: TPagination;
	}

	Object.defineProperty(ResponseClass, 'name', {
		value: `GenericResponseOf${model?.name || 'void'}${isArray ? 'Array' : ''}`,
	});

	genericResponseCache.set(cacheKey, ResponseClass);

	return ResponseClass;
}
