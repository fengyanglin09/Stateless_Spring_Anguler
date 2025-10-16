import { Injectable } from '@angular/core';
import {OAuthEvent, OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import {filter, merge, Observable, of, ReplaySubject, shareReplay, switchMap, timer} from 'rxjs';
import {AppSession} from '../../shared/models/appSession.model';

@Injectable({
  providedIn: 'root'
})
export class AppAuthenticationService {


  sessionObservable!: Observable<AppSession>
  sessionRefreshRate: number = 1;
  sessionAutoRefreshIntervalTrigger: Observable<number> = timer(0, this.sessionRefreshRate * 60 * 1000);
  sessionManualRefreshTrigger: ReplaySubject<AppSession> = new ReplaySubject(1);


  constructor(private oAuthService: OAuthService,
              private router: Router
  ) {

    this.loginEventHandling();

    /**
     *
     * This code creates an observable (sessionObservable) that emits updated user session data. It listens to two sources:
     *
     *
     * sessionManualRefreshTrigger : emits when the session is manually updated (e.g., after login or role change).
     * sessionAutoRefreshIntervalTrigger : emits at a regular interval (every minute).
     *
     * Whenever either source emits, it triggers getUpdatedSession() to fetch the latest session from the authentication provider. The result is shared with all subscribers, ensuring everyone gets the latest session without duplicate fetches.
     *
     * */

    this.sessionObservable = merge(this.sessionAutoRefreshIntervalTrigger, this.sessionManualRefreshTrigger)
      .pipe(
        switchMap(() => this.getUpdatedSession()),
        shareReplay(1)
      )

  }


  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken() && this.oAuthService.hasValidIdToken();
  }


  login(){
    this.oAuthService.initCodeFlow();
  }


  /**
   * this method listens for specific OAuth events related to user authentication and session management. It filters the event stream to only include events that indicate significant changes in the authentication state, such as receiving a token, encountering a token error, session termination, or errors loading the discovery document.
   * These filtered events can then be used to trigger appropriate actions in the application, such as updating the UI, redirecting the user, or logging information for debugging purposes.
   * */
  loginEventHandling() {
    this.oAuthService.events
      .pipe(
        filter((e: OAuthEvent) =>
          e.type === 'token_received' ||
          e.type === 'token_error' ||
          e.type === 'session_terminated' ||
          e.type === 'discovery_document_load_error' ||
          e.type === 'silent_refresh_timeout' ||
          e.type === 'silent_refresh_error'
        )
      )
      .subscribe((e) => {
        console.log('OAuth Event:', e.type);

        switch (e.type) {
          case 'token_received':
            console.log('✅ Authentication succeeded');
            break;

          case 'token_error':
          case 'silent_refresh_timeout':
          case 'silent_refresh_error':
          case 'session_terminated':
          case 'discovery_document_load_error':
            console.warn('❌ Authentication failed or ended');
            this.logout()
            break;
        }
      });
  }




  logout(){
    this.oAuthService.logOut(true); // performs full logout including redirect to the identity provider's logout endpoint
    console.log('Logout, Redirecting to login page...');
    this.router.navigate(['/login']);
  }

  private getUpdatedSession() {
    //todo - to be implemented
    return of();
  }

}
