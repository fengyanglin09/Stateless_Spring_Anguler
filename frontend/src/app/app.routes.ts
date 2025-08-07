import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {Profile} from './components/profile/profile';
import {inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';


export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'profile',
    component: Profile,
    canActivate: [
      () => {
        const oauthService = inject(OAuthService);
        if (oauthService.hasValidAccessToken() && oauthService.hasValidIdToken()) {
          return true;
        }
        oauthService.initCodeFlow();
        return false;
      },
    ],
  },
];
