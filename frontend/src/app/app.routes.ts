import { Routes } from '@angular/router';

import {inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {OauthGuard} from './core/security/oauth.guard';
import {AppLayout} from './features/layout';
import {Profile} from './shared/components/profile/profile';


export const routes: Routes = [
  { path: '', component: AppLayout },
  {
    path: 'spa',
    canActivateChild: [OauthGuard],
    children: [
      { path: 'profile', component: Profile },
      // { path: 'settings', component: Settings }
    ]
  }
];
