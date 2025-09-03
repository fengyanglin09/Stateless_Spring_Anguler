import {InjectionToken} from "@angular/core";
import {AppAuthenticationProvider} from '../provider/app.authentication-provider';
import {AppConfigurationProvider} from '../provider/app.configuration-provider';
import {AppMenuProvider} from '../provider/app.menu-provider';
import {AppSessionMonitorProvider} from '../provider/app.session-monitor-provider';



export const APP_AUTHENTICATION_PROVIDER = new InjectionToken<AppAuthenticationProvider>('APP_AUTHENTICATION_PROVIDER');
export const APP_CONFIGURATION_PROVIDER = new InjectionToken<AppConfigurationProvider>('APP_CONFIGURATION_PROVIDER');
export const APP_MENU_PROVIDER = new InjectionToken<AppMenuProvider>('APP_MENU_PROVIDER');
export const APP_SESSION_MONITOR_PROVIDER = new InjectionToken<AppSessionMonitorProvider>('APP_SESSION_MONITOR_PROVIDER');
