import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {MayoTheme} from 'mqml-angular-ui-layout-sdk/layout-template/themes';
import {MessageService} from 'primeng/api';
import {TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {
  APP_AUTHENTICATION_PROVIDER,
  APP_CONFIGURATION_PROVIDER, APP_MENU_PROVIDER, APP_SESSION_MONITOR_PROVIDER,
  AppConfigurationService
} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {AppAuthenticationProvider} from './core/providers/app-authentication-provider';
import {AppConfigurationProvider} from './core/providers/app-configuration-provider';
import {AppSessionMonitorProvider} from './core/providers/app-session-monitor-provider';
import {AppMenuProvider} from './core/providers/app-menu-provider';

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
    {provide: APP_AUTHENTICATION_PROVIDER, useClass: AppAuthenticationProvider},
    {provide: APP_CONFIGURATION_PROVIDER, useClass: AppConfigurationProvider},
    {provide: APP_MENU_PROVIDER, useClass: AppMenuProvider},
    {provide: APP_SESSION_MONITOR_PROVIDER, useClass: AppSessionMonitorProvider},
    {provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js"},
    provideAppInitializer(()=>{
      inject(AppConfigurationService).load()
        .then(()=>{
          console.debug('Application configuration successfully loaded.');
        })
        .catch(error=>{
          console.debug('Error loading application configuration.', error);
        })
    })
  ]
};

