import {inject, Inject, Injectable} from '@angular/core';

import {Observable} from "rxjs";
import {MenuItem} from "primeng/api";
import {APP_MENU_PROVIDER} from '../provider-constant/app.constants-providers';
import {AppMenuProvider} from '../provider/app.menu-provider';
import {AppAuthentication} from '../model/app.authentication';
import {AppSearchMenu} from '../model/app.search-menu';
import {AppMenuButton} from '../model/app.menu-button';
import {AppPollingService} from './app.polling.services';



@Injectable({
    providedIn: 'root'
})
export class AppMenuService {


    private menuProvider: AppMenuProvider = inject(APP_MENU_PROVIDER);
    private pollingService: AppPollingService = inject(AppPollingService);

    constructor() {
    }


    getUserMenuItems(authentication: AppAuthentication | null): Observable<MenuItem[]> {
        return this.menuProvider.getUserMenuItems(authentication);
    }

    getMainMenuItems(authentication: AppAuthentication | null): Observable<MenuItem[]> {
        return this.menuProvider.getMainMenuItems(authentication);
    }

    getSearchMenu(authentication: AppAuthentication | null): Observable<AppSearchMenu | void> {
        return this.menuProvider.getSearchMenu(authentication);
    }

    getTopBarMenuButtons(authentication: AppAuthentication | null): Observable<AppMenuButton[]> {
        return new Observable<AppMenuButton[]>(subscriber => {
            this.menuProvider.getTopBarMenuButtons(authentication).subscribe((buttons) => {

                // Start polling badge updates (only if configured)
                this.pollingService.startPolling(buttons, (updated) => {
                    subscriber.next(updated); // push new badge count
                });

                subscriber.next(buttons);
            });

            // Optional: teardown polling when unsubscribed
            return () => {
                this.pollingService.stopPolling();
            };
        });
    }

}
