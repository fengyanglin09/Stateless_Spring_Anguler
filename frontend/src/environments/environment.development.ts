import {AuthConfig} from 'angular-oauth2-oidc';

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

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authCodeFlowConfig: {
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`, // Azure Entra ID issuer
    strictDiscoveryDocumentValidation: false,
    redirectUri: `${redirectUri}`, // Your Angular app's redirect URI
    clientId: `${frontEndClientId}`, // Your Angular app's client ID
    responseType: 'code',
    scope: scopes.join(' '),
    showDebugInformation: true,
    silentRefreshRedirectUri: `${redirectUri}/silent-refresh.html`,
    useSilentRefresh: false,
    disablePKCE: false,
  } as AuthConfig
};
