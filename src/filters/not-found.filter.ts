import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { ResponseUtil } from '../utils/response.util';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private excludePattern?: RegExp) { }

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Si la ruta coincide con el patrón de exclusión, no aplicar el filtro
    if (this.excludePattern && !this.excludePattern.test(request.url)) {
      return response.status(404).send(exception.message);
    }

    response.status(404).json(ResponseUtil.notFound('Ruta no encontrada'));
  }
}