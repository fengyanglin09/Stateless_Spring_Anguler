import {Observable} from "rxjs";
import {AppSession} from '../model/app.session';
import {AppAuthentication, AppRole} from '../model/app.authentication';


export interface AppAuthenticationService {

  refreshRate: number;

  landingRoute: string;

  isAuthenticated(): Observable<boolean>;

  getSession(): Observable<AppSession>;

  getAllRoles(): Observable<AppRole[]>;

  updateUserRoles(roles: AppRole[]): Observable<AppAuthentication>;

  clearSession(): void;

  logout(): void;

}
