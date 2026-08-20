import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners,  provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

export function jwtOptionsFactory() {
  return {
    // Pas de tokenGetter nécessaire avec les cookies !
    // Le cookie est géré automatiquement par le navigateur
  };
}

registerLocaleData(localeFr)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: JWT_OPTIONS,
      useFactory: jwtOptionsFactory,
    },
    JwtHelperService,
    {
      provide: LOCALE_ID,
      useValue: 'fr'
    }
  ]
};
