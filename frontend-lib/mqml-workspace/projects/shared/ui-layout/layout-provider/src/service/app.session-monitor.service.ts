import {inject, Injectable} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {AppMonitorStatus} from '../model/app.monitor-status';
import {APP_SESSION_MONITOR_PROVIDER} from '../provider-constant/app.constants-providers';
import {AppLocalStorageService} from './app.local-storage.service';
import {AppDefaultAuthenticationService} from './app.default-authentication.service';
import {AppConfigurationService} from './app.configuration.service';
import {ifvisible} from '@rosskevin/ifvisible';
import {error} from 'ng-packagr/src/lib/utils/log';


@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class AppSessionMonitorService {

    /** Variables **/
    active: boolean = false;
    debug: boolean = false;
    intervalId: any = undefined;
    pollTimeDuration: number = 30; // Default 30 seconds
    statusCallback: ((status: AppMonitorStatus) => void) | undefined = undefined;
    localStorageKey: string = 'sessionLastActiveTime';
    defaultIdleDuration: number = 3600; // Default 60m * 60s = 3600 seconds (1 hour)

  private appSessionMonitorProvider = inject(APP_SESSION_MONITOR_PROVIDER, { optional: true });

    constructor(
                private router: Router,
                private localStorageService: AppLocalStorageService,
                private authenticationService: AppDefaultAuthenticationService,
                private appConfigurationService: AppConfigurationService) {

        if (this.appSessionMonitorProvider) {
            const sessionMonitorConfiguration = this.appConfigurationService?.configuration?.sessionMonitor;
            this.debug = sessionMonitorConfiguration?.debug || false;
            ifvisible.setIdleDuration(sessionMonitorConfiguration?.idleDuration || this.defaultIdleDuration);
            ifvisible.on('idle', () => {
                this.log('Idle detected, stopping session monitor.');
                this.stop();
            });
            ifvisible.on('wakeup', () => {
                this.log('Wakeup detected, starting session monitor.');
                this.start();
            });
        }
        else{
          throw new Error('AppSessionMonitorProvider is not provided. Please provide it in your module.');
        }
    }

    setIdleDuration(seconds: number): AppSessionMonitorService {
        ifvisible.setIdleDuration(seconds);
        return this;
    }

    setPollDuration(seconds: number): AppSessionMonitorService {
        this.pollTimeDuration = seconds;
        return this;
    }

    setStatusCallback(callback: (status: AppMonitorStatus) => void): AppSessionMonitorService {
        this.statusCallback = callback;
        return this;
    }

    start(): AppSessionMonitorService {
        this.log("Starting...");
        this.active = true;
        this.updateSessionLastActiveTime();
        this.intervalId = setInterval(() => this.checkSession(), this.pollTimeDuration * 1000);
        return this;
    }

    stop(): AppSessionMonitorService {
        this.log("Stopping...");
        this.active = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        return this;
    }

    isActive(): boolean {
        return this.active;
    }

    updateSessionLastActiveTime(): void {
        this.log('Updating session last active time...')
        this.localStorageService.set(this.localStorageKey, new Date().getTime().toString());
    }

    onSessionExpired(): void {
        this.log('Session expired, redirecting to ' + this.authenticationService.landingRoute);
        this.router.navigate([this.authenticationService.landingRoute])
            .finally(() => this.stop());
    }

    private checkSession(): void {
        this.log(`Idle: ${this.isIdle()} Session: ${this.isSessionStale()}  Page visible: ${this.isPageVisible()}`);
        if (this.isIdle() && this.isSessionStale()) {
            this.log("Idle or session stale detected, stopping session monitor.");
            this.stop();
        } else {
            this.log("User is active.");
            this.checkStatus();
        }
    }

    private checkStatus(): void {
        this.log("Keep alive.");

        const sessionMonitorProvider = this.appSessionMonitorProvider;
        if (!sessionMonitorProvider) {
            throw new Error('AppSessionMonitorProvider is not provided. Please provide it in your module.');
        }

        forkJoin({
            session: this.authenticationService.getSession(),
            status: sessionMonitorProvider.getStatus()
        }).pipe(
            untilDestroyed(this)
        ).subscribe({
            next: ({session, status}) => {
                if (!session.isAuthenticated() || session.isExpired()) {
                    this.log('Session expired or not authenticated....');
                    this.onSessionExpired()
                    return;
                }

                if (!this.isIdle() && this.isPageVisible()) {
                    this.updateSessionLastActiveTime();
                }

                if (this.statusCallback) {
                    this.statusCallback(status);
                }
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error retrieving session and status.', error);
                if (error.status === 0 || error.status === 503) {
                    this.onSessionExpired();
                }
            }
        });
    }

    private isSessionStale(): boolean {
        const currentTime = new Date().getTime();
        const sessionLastActiveTime: number = this.localStorageService.get(this.localStorageKey);
        const currentActiveTime = (currentTime - (sessionLastActiveTime === null ? 0 : sessionLastActiveTime)) / 1000;
        this.log(`Idle Duration:${this.getIdleDuration()}, Current Idle Duration:${currentActiveTime}, Session Stale: ${currentActiveTime >= this.getIdleDuration()}`);
        return currentActiveTime >= this.getIdleDuration();
    }

    private isIdle(): boolean {
        return ifvisible.getIdleInfo().isIdle;
    }

    private isPageVisible(): boolean {
        return ifvisible.now();
    }

    private getIdleDuration(): number {
        return ifvisible.getIdleDuration() / 1000; // Convert from milliseconds to seconds
    }


    private log(data: any): void {
        if (this.debug) {
            // eslint-disable-next-line no-console
            console.debug("Session Monitor:", data);
        }
    }
}
