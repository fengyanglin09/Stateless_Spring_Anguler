import {Observable} from "rxjs";
import {AppConfiguration} from '../model/app.configuration';


export interface AppConfigurationProvider {

  getConfiguration(): Observable<AppConfiguration>

}
