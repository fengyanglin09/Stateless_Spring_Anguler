import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppDefaultAuthenticationService} from '../../service/app.default-authentication.service';
import {AppConfigurationService} from '../../service/app.configuration.service';
import {untilDestroyed} from '@ngneat/until-destroy';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'lib-app-landing',
  imports: [
    ButtonDirective,
    Ripple
  ],
  templateUrl: './app-landing.html',
  styleUrl: './app-landing.scss'
})
export class AppLanding {
  backgroundUrl: string = "/assets/images/landing.png";

  constructor(private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AppDefaultAuthenticationService,
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
