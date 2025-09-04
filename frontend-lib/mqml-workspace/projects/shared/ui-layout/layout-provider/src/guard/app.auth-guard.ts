import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {inject} from "@angular/core";
import {AppDefaultAuthenticationService} from '../service/app.default-authentication.service';

export namespace AppAuthGuard {

  export const canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    const authenticationService = inject(AppDefaultAuthenticationService);
    const router = inject(Router);
    return authenticationService.getSession()
      .pipe(map(session => {
        if (!session || !session.isAuthenticated()) {
          console.warn('No valid session found, redirecting to landing page');
          router.navigate([authenticationService.landingRoute]);
          return false;
        }
        if (next.data['roles']) {
          return session.hasAnyRole(next.data['roles']);
        }
        return session.isAuthenticated();
      }));
  }

  export const canActivateChild = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);

}


