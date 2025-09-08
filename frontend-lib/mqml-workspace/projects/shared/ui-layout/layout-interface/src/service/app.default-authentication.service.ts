import {inject, Inject, Injectable} from '@angular/core';

import {catchError, merge, Observable, of, ReplaySubject, shareReplay, switchMap, take, tap, timer} from "rxjs";
import {map} from "rxjs/operators";


import {Router} from "@angular/router";

import {UntilDestroy} from "@ngneat/until-destroy";
import {AppAuthenticationService} from './app.authentication-service';
import {AppSession} from '../model/app.session';
import {APP_AUTHENTICATION_PROVIDER, APP_CONFIGURATION_PROVIDER} from '../provider-constant/app.constants-providers';
import {AppAuthenticationProvider} from '../provider/app.authentication-provider';
import {AppConfigurationProvider} from '../provider/app.configuration-provider';
import {AppAuthentication, AppRole} from '../model/app.authentication';

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class AppDefaultAuthenticationService implements AppAuthenticationService {

    private authenticationProvider: AppAuthenticationProvider = inject<AppAuthenticationProvider>(APP_AUTHENTICATION_PROVIDER);
    private configurationProvider: AppConfigurationProvider = inject<AppConfigurationProvider>(APP_CONFIGURATION_PROVIDER);

    refreshRate: number = 1;
    landingRoute: string = '/landing'
    sessionObservable!: Observable<AppSession>;
    refreshInterval = timer(0, this.refreshRate * 60 * 1000);
    replaySubject: ReplaySubject<AppSession> = new ReplaySubject(1);

    constructor(private router: Router) {

        if(!this.configurationProvider) {
          throw new Error('AppConfigurationProvider is not provided');
        }

        if(!this.authenticationProvider) {
          throw new Error('AppAuthenticationProvider is not provided');
        }

        this.sessionObservable = merge(this.replaySubject, this.refreshInterval)
            .pipe(
                switchMap(() => this.getUpdatedSession()),
                shareReplay(1)
            )
    }

    isAuthenticated(): Observable<boolean> {
        return this.getSession()
            .pipe(map(session => {
                return session !== undefined;
            }));
    }

    getAllRoles(): Observable<AppRole[]> {
        return this.authenticationProvider.getAllRoles();
    }

    updateUserRoles(roles: AppRole[]): Observable<AppAuthentication> {
        return this.authenticationProvider.updateUserRoles(roles)
            .pipe(tap(appAuthentication => {
                this.replaySubject.next(new AppSession(appAuthentication))
            }));

    }


    getSession(): Observable<AppSession> {
        return this.sessionObservable.pipe(take(1));
    }

    getSessionListener(): Observable<AppSession> {
        return this.sessionObservable;
    }

    clearSession(): void {
        this.replaySubject = new ReplaySubject(1);
    }

    login(): void {
        this.authenticationProvider.login();
    }

    logout(): void {
        this.clearSession();
        this.authenticationProvider.logout();
        this.navigateLandingPage();
    }

    private getUpdatedSession(): Observable<AppSession> {
        return this.authenticationProvider.getAuthentication()
            .pipe(
                map(authentication => {
                    console.debug('Provided session:', authentication);
                    return new AppSession(authentication)
                }),
                catchError((error) => {
                    console.error('Error retrieving user session:', error)
                    this.navigateLandingPage();
                    return of(new AppSession(null));
                })
            );
    }

    private navigateLandingPage(): void {
        console.log('Redirecting to landing page...');
        this.router.navigate([this.landingRoute]);
    }

}

