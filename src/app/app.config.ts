// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter }   from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader }              from '@ngx-translate/http-loader';
import { provideAnimations }                from '@angular/platform-browser/animations';
import { provideToastr }                    from 'ngx-toastr';

import { routes }               from './app.routes';
import { apiKeyInterceptor }    from './services/api-key.interceptor';

// Factory que ajusta prefix y suffix según la firma de TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const translateConfig = {
  defaultLanguage: 'en',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut: 10000,
      preventDuplicates: true,
      progressBar: true
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot(translateConfig)
    )
  ]
};
