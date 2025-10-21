import {OAuthService} from 'angular-oauth2-oidc';
import {AppAuthenticationService} from '../services/app-authentication.service';
import {environment} from '../../../environments/environment.development';


export function initializeAuth(oauthService: OAuthService, appAuthService: AppAuthenticationService) {
  return () => {
    oauthService.configure(environment.authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();

    return oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (oauthService.hasValidAccessToken()) {
          // const token = oauthService.getAccessToken();
          // console.log('Access Token:', token);
          // console.log('Token Claims:', oauthService.getIdentityClaims());
          console.log('✅ OAuth successfully initialized');
          appAuthService.loadUserProfile();
        } else {
          console.warn('⚠️ No valid access token found, redirecting to login...');
          appAuthService.logout();
          // router.navigate(['/login']);
        }
      })
      .catch((error) => {
        console.error('❌ Auth error:', error);
        // router.navigate(['/login']);
        appAuthService.logout();
      });
  };
}

