import { Injectable } from '@angular/core';
import {AppConfiguration} from '../../shared/models/appApi.model';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {

  configuration: AppConfiguration = {
    applicationName: '',
    baseUrl: '',
    environmentName: 'development',
    environmentRibbonVisible: false,

    applicationFooter: {
      leftContent: ''
    }
  }

  clearCache(): void {
    window.localStorage.clear();
    console.debug('Cache cleared successfully...');
    window.location.reload();
  }

}
