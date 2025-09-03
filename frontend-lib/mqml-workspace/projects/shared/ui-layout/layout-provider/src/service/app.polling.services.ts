// services/topbar-polling.service.ts
import { Injectable } from '@angular/core';
import { interval, of, Subscription, from, isObservable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {AppMenuButton} from '../model/app.menu-button';


@Injectable({
    providedIn: 'root',
})
export class AppPollingService {
    private pollSubscriptions: Record<string, Subscription> = {};

    startPolling(
        buttons: AppMenuButton[],
        onUpdate: (updatedButtons: AppMenuButton[]) => void
    ): void {
        this.stopPolling();

        for (const button of buttons) {
            if (button.badgeValueResolver && button.pollIntervalSeconds) {
                const sub = interval(button.pollIntervalSeconds * 1000)
                    .pipe(
                        switchMap(() => {
                            const result = button.badgeValueResolver!();
                            if (typeof result === 'number') return of(result);
                            if (result instanceof Promise) return from(result).pipe(catchError(() => of(0)));
                            if (isObservable(result)) return result.pipe(catchError(() => of(0)));
                            return of(0);
                        })
                    )
                    .subscribe((newCount) => {
                        button.badgeValue = newCount;
                        onUpdate([...buttons]); // Immutable update
                    });

                this.pollSubscriptions[button.id] = sub;
            }
        }
    }

    stopPolling(): void {
        Object.values(this.pollSubscriptions).forEach(sub => sub.unsubscribe());
        this.pollSubscriptions = {};
    }
}
