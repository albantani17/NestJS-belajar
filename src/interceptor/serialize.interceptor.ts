import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function Serialize(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<unknown>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe()
      .pipe(
        map((data) => {
          return plainToClass(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }),
      );
  }
}
