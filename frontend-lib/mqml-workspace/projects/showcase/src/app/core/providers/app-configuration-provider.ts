import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {AppConfiguration} from 'mqml-angular-ui-layout-sdk/layout-interface';

@Injectable()
export class AppConfigurationProvider implements AppConfigurationProvider {

  constructor() {
  }

  getConfiguration(): Observable<AppConfiguration> {
    return of({
      applicationName: 'Appence Angular Showcase',
      applicationDescription: 'Showcase for the Appence Angular library',
      baseUrl: environment.baseUrl,
      environmentName: 'Demo',
      environmentRibbonVisible: true,
      sessionMonitor: {
        enabled: false,
        idleDuration: 30 * 60, // 30 minutes,
        debug: true
      },
      applicationFooter: {
        leftContent: '<span>Please contact the App developers to report any bugs or improvements</span>'
      }
    });
  }


}
