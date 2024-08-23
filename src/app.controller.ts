import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { context, trace } from '@opentelemetry/api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query('name') name: string): string {
    const currentSpan = trace.getSpan(context.active());
    if (currentSpan) {
      console.log('Current span:', currentSpan);
      // Adicione informações adicionais ao span
      currentSpan.setAttribute('request.user', name);
    }

    // Simulando processamento de requisição
    const response = this.appService.getHello(name);
    console.log(response);

    return response;
  }
}
