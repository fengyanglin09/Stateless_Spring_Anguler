import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private oauthService = inject(OAuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request to:', req.url);
    if (req.url.startsWith('http://localhost:8080/api/')) {
      let idToken = this.oauthService.getIdToken();
      const accessToken = this.oauthService.getAccessToken();
      console.log('Id Token for request:', idToken ? idToken : 'Missing');
      console.log('Access Token for request:', accessToken ? accessToken : 'Missing');
      console.log(this.oauthService.getIdentityClaims())
      if (accessToken) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Added Authorization header:', req.headers.get('Authorization'));
      } else {
        console.log('No token available for:', req.url);
      }
    } else {
      console.log('Request URL does not match API:', req.url);
    }
    return next.handle(req);
  }
}
