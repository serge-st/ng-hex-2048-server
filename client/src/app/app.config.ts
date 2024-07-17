import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { universalInterceptor } from './shared/interceptors';
import { GlobalErrorHandler } from './global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    // TODO re-check the implementation
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler,
    // },
    provideHttpClient(withInterceptors([universalInterceptor])),
  ],
};
