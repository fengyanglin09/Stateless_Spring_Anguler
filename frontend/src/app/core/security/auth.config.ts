import {AuthConfig, OAuthEvent, OAuthService} from 'angular-oauth2-oidc';
import {filter} from 'rxjs';
import {Router} from '@angular/router';

const tenantId = 'a25fff9c-3f63-4fb2-9a8a-d9bdd0321f9a'; // Replace with your Azure Entra ID tenant ID

const frontEndClientId = '483a2857-ef87-4f5f-b9b5-8cdf2c031586'; // Replace with your Angular app's client ID

const backEndClientId = '6b4f8dcc-e7d3-4d30-ab85-20851dca2013'; // Replace with your Spring Boot app's client ID

const redirectUri = 'http://localhost:4200'; // Replace with your Angular app's redirect URI

const scopes: string[] = [
  'openid',
  'profile',
  'email',
  `api://${backEndClientId}/access_as_user`
]
export const authCodeFlowConfig: AuthConfig = {
  issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`, // Azure Entra ID issuer
  strictDiscoveryDocumentValidation: false,
  // loginUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  // tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  redirectUri: `${redirectUri}`, // Your Angular app's redirect URI
  clientId: `${frontEndClientId}`, // Your Angular app's client ID
  responseType: 'code',
  // scope: 'openid profile email offline_access api://<spring-boot-client-id>/access_as_user',
  scope: scopes.join(' '),
  // scope: `api://c0b121a0-2ae7-4e57-8a7b-53d02feb5788/access_as_user` ,
  showDebugInformation: true,
  silentRefreshRedirectUri: `${redirectUri}/silent-refresh.html`,
  useSilentRefresh: false,
  disablePKCE: false,
};


export function initializeAuth(oauthService: OAuthService, router: Router) {
  return () => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    return oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (oauthService.hasValidAccessToken()) {
          // const token = oauthService.getAccessToken();
          // console.log('Access Token:', token);
          // console.log('Token Claims:', oauthService.getIdentityClaims());
          console.log('OAuth successfully initialized');
        }
      })
      .catch((error) => {
        console.error('Auth error:', error);
        throw error;
      });
  };
}
