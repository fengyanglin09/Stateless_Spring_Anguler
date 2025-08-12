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
      const token = this.oauthService.getAccessToken();
      console.log('Token for request:', token ? token : 'Missing');
      console.log(this.oauthService.getIdentityClaims())
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
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
