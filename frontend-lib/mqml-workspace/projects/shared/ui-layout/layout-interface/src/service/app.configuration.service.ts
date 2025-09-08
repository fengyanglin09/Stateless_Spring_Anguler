import {inject, Inject, Injectable} from '@angular/core';

import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AppConfiguration} from '../model/app.configuration';
import {AppConfigurationProvider} from '../provider/app.configuration-provider';
import {APP_CONFIGURATION_PROVIDER} from '../provider-constant/app.constants-providers';
import {firstValueFrom} from 'rxjs';


@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class AppConfigurationService {
  private configurationProvider = inject<AppConfigurationProvider>(APP_CONFIGURATION_PROVIDER);

    configuration: AppConfiguration = {
        applicationName: '',
        baseUrl: '',
        environmentName: '',
        environmentRibbonVisible: false,
        sessionMonitor: {
            enabled: true,
            idleDuration: 0
        },
        applicationFooter: {
            leftContent: ''
        }
    }

    constructor() {

      if (!this.configurationProvider) {
        throw new Error('AppConfigurationProvider is not provided');
      }
    }

    // async load(): Promise<void> {
    //   try {
    //     this.configuration = await firstValueFrom(
    //       this.configurationProvider.getConfiguration().pipe(untilDestroyed(this))
    //     );
    //   } catch (error) {
    //     console.error('Unknown error retrieving configuration.', error);
    //     throw error;
    //   }
    // }

    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.configurationProvider.getConfiguration()
                .pipe(untilDestroyed(this))
                .subscribe({
                    next: (configuration) => {
                        this.configuration = configuration;
                        resolve();
                    },
                    error: (error) => {
                        console.error('Unknown error retrieving configuration.', error);
                        reject(error);
                    }
                })
        });
    }

    clearCache(): void {
        window.localStorage.clear();
        console.debug('Cache cleared successfully...');
        window.location.reload();
    }

}
