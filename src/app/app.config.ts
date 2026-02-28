import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
 
export const appConfig: ApplicationConfig = {
  providers: [
    // Routing — enables navigation between pages
    provideRouter(routes),
 
    // HTTP client — enables API calls to Spring Boot backend
    // withInterceptors will be filled in Phase 2 (JWT interceptor)
    provideHttpClient(withInterceptors([])),
  ]
};
