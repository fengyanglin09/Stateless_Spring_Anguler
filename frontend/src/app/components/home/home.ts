import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  constructor(private oauthService: OAuthService) {}

  login() {
    this.oauthService.initCodeFlow();
  }

}
