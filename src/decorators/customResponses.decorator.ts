import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export const ApiCustomResponses = ({
  summary,
  successExample,
}: {
  summary: string;
  successExample: any;
}) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 200,
      description: 'Operación exitosa',
      schema: { example: successExample },
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
      schema: {
        example: {
          message: 'Error interno del servidor',
          error: true,
          statusCode: 500,
        },
      },
    })
  );
};