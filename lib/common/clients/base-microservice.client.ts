import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseMicroserviceClient {
  constructor(@Inject('SERVICE_TOKEN') protected client: ClientProxy) {}

  protected async send<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult> {
    return await firstValueFrom(this.client.send<TResult>(pattern, data));
  }
}
