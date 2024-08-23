// tracing.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { context, trace } from '@opentelemetry/api';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentSpan = trace.getSpan(context.active());
    if (currentSpan) {
      console.log('Current span:', currentSpan);
      // Adicione informações adicionais ao span
      currentSpan.setAttribute('authenticated.user', 'leonardom'); // Substitua pelo usuário autenticado real
    }
    next();
  }
};