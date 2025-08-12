import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const OauthGuard: CanActivateFn = () => {
  const oauthService = inject(OAuthService);
  if (oauthService.hasValidAccessToken() && oauthService.hasValidIdToken()) {
    return true;
  }
  oauthService.initCodeFlow();
  return false;
};
