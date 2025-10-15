import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AppAuthenticationService} from '../../../../core/services/app-authentication.service';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {AppConfigurationService} from '../../../../core/services/app-configuration.service';


@UntilDestroy()
@Component({
  selector: 'app-app-login',
  imports: [
    ButtonDirective,
    Ripple
  ],
  templateUrl: './app-login.html',
  styleUrl: './app-login.scss'
})
export class AppLogin {

  backgroundUrl: string = "/assets/images/landing.png";

  constructor(private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AppAuthenticationService,
              protected configurationService: AppConfigurationService) {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data['backgroundUrl']) {
            this.backgroundUrl = data['backgroundUrl'];
          }
        },
        error: (error) => {
          console.error('Error retrieving landing page url.', error);
        }
      });
  }

  login(): void {
    this.authenticationService.login();
  }

}
