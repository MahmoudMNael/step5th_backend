import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function GenericResponseType<
	TModel extends Type<any>,
	TPagination extends Type<any>,
>(model?: TModel, inputPagination?: TPagination) {
	class ResponseClass {
		@ApiProperty()
		message: string;

		@ApiProperty({ required: false, type: model })
		data: TModel;

		@ApiProperty({ required: false, type: inputPagination })
		pagination?: TPagination;
	}

	Object.defineProperty(ResponseClass, 'name', {
		value: `GenericResponseOf${model?.name || 'void'}`,
	});
	return ResponseClass;
}
