import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {MayoTheme} from 'mqml-angular-ui-layout-sdk/layout-template/themes';
import {MessageService} from 'primeng/api';
import {TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    providePrimeNG({
      ripple: true,
      inputStyle: 'filled',
      theme: MayoTheme
    }),
    MessageService,
    {provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js"},
  ]
};

