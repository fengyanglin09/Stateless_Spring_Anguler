import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import {AppAuthenticationService} from '../services/app-authentication.service';

export const OauthGuard: CanActivateFn = () => {
  const oauthService = inject(AppAuthenticationService);
  if (oauthService.isAuthenticated()) {
    return true;
  }
  oauthService.login();
  return false;
};
