/**
 * Client application configuration: routing, HTTP (with JWT), hydration, and auth bootstrap.
 */
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AUTH_API_URL } from './libs/auth/auth.token';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthService } from './libs/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    // `withFetch` uses the Fetch API for HttpClient; `jwtInterceptor` attaches Bearer tokens.
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    {
      provide: AUTH_API_URL,
      useValue: 'https://exam-app.elevate-bootcamp.cloud/api',
    },
    // Restore session from `localStorage` before the first routed view resolves.
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      authService.loadTokenFromStorage();
    }),
  ],
};
