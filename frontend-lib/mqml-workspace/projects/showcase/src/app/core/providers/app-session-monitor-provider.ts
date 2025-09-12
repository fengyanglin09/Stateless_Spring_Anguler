import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {AppMonitorStatus} from 'mqml-angular-ui-layout-sdk/layout-interface';

@Injectable()
export class AppSessionMonitorProvider implements AppSessionMonitorProvider {

    getStatus(): Observable<AppMonitorStatus> {
        return of({
            maintenanceMode: false
        })
    }

}
