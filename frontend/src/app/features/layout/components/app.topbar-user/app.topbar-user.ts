import {Component} from '@angular/core';
import {StyleClass} from 'primeng/styleclass';
import {Avatar} from 'primeng/avatar';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AppConfigurationService} from '../../../../core/services/app-configuration.service';
import {AppAuthenticationService} from '../../../../core/services/app-authentication.service';
import {AppSession} from '../../../../shared/models/appSession.model';

@Component({
  selector: '[app-topbar-user]',
  imports: [
    StyleClass,
    Avatar,
    ButtonDirective,
    Ripple,
    NgIf,
    RouterLink,
    NgClass,
    NgForOf
  ],
  templateUrl: './app.topbar-user.html',
  styleUrl: './app.topbar-user.scss'
})
export class AppTopbarUser {
  userMenuItems: any = [{label: 'Profile', icon: 'fa-solid fa-user', routerLink: ['/profile']}];

  appSession?: AppSession;

  constructor(
    public appConfiguration: AppConfigurationService,
    public appAuthenticationService: AppAuthenticationService,
  ) {
    this.appSession = this.appAuthenticationService.appSession;
  }


  logout() {
    this.appAuthenticationService.logout();
  }
}
