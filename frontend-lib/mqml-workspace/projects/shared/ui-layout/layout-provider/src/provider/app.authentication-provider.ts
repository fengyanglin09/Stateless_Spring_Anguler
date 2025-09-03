import {Observable} from "rxjs";
import {AppAuthentication, AppRole} from '../model/app.authentication';


export interface AppAuthenticationProvider {
  getAuthentication(): Observable<AppAuthentication | null>

  getAllRoles(): Observable<AppRole[]>;

  updateUserRoles(roles: AppRole[]): Observable<AppAuthentication>;

  login(): void

  logout(): void
}
