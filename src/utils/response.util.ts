import { HttpException, HttpStatus } from '@nestjs/common';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(
      {
        message,
        error: true,
        statusCode: status,
      },
      status
    );
  }
}

export class ResponseUtil {
  static success(message: string, data?: any) {
    return {
      message,
      data: data || null,
      error: false,
      statusCode: HttpStatus.OK,
    };
  }

  static error(message: string) {
    throw new CustomHttpException(message, HttpStatus.BAD_REQUEST);
  }

  static notFound(message: string) {
    throw new CustomHttpException(message, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message: string) {
    throw new CustomHttpException(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string) {
    throw new CustomHttpException(message, HttpStatus.FORBIDDEN);
  }

  static internalServerError(message: string) {
    throw new CustomHttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static badRequest(message: string) {
    throw new CustomHttpException(message, HttpStatus.BAD_REQUEST);
  }
}

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        // Si la respuesta ya tiene el formato correcto, la devolvemos tal cual
        if (response && response.hasOwnProperty('message') && response.hasOwnProperty('data')) {
          return response;
        }

        // Si no, construimos la respuesta con el formato correcto
        return {
          message: 'Operación exitosa',
          data: response,
          error: false,
          statusCode: context.switchToHttp().getResponse().statusCode,
        };
      })
    );
  }
}