import {Observable} from "rxjs";
import {AppMonitorStatus} from '../model/app.monitor-status';


export interface AppSessionMonitorProvider {

    getStatus(): Observable<AppMonitorStatus>

}
