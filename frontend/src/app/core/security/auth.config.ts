import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';

const tenantId = 'a25fff9c-3f63-4fb2-9a8a-d9bdd0321f9a'; // Replace with your Azure Entra ID tenant ID

const clientId = 'a9f477ca-c91c-4d40-a9f8-f2d8923b74a4'; // Replace with your Angular app's client ID

const redirectUri = 'http://localhost:4200'; // Replace with your Angular app's redirect URI

export const authCodeFlowConfig: AuthConfig = {
  issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`, // Azure Entra ID issuer
  redirectUri: `${redirectUri}`, // Your Angular app's redirect URI
  clientId: `${clientId}`, // Your Angular app's client ID
  responseType: 'code',
  // scope: 'openid profile email offline_access api://<spring-boot-client-id>/access_as_user',
  scope: 'openid profile email offline_access' ,
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  silentRefreshRedirectUri: `${redirectUri}/silent-refresh.html`,
  useSilentRefresh: true,
  disablePKCE: false,
};


export function initializeAuth(oauthService: OAuthService) {
  return () => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    return oauthService.loadDiscoveryDocumentAndTryLogin().catch((error) => {
      console.error('Failed to load discovery document or login:', error);
      throw error; // Propagate error for debugging
    });
  };
}
