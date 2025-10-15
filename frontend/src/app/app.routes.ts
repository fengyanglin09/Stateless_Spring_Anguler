import { Routes } from '@angular/router';

import {inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {OauthGuard} from './core/security/oauth.guard';
import {AppError, AppLayout, AppLogin, AppNotFound} from './features/layout';
import {Profile} from './shared/components/profile/profile';


export const routes: Routes = [
  { path: '', component: AppLayout, canActivate: [OauthGuard], canActivateChild: [OauthGuard]

  },
  {path: 'error', component: AppError},
  {path: 'login', component: AppLogin},
  {path: '**', component: AppNotFound}
];
