import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HelperService } from './helper.service';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Global()
@Module({
  providers: [
    HelperService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [HelperService],
})
export class GlobalModule {}
