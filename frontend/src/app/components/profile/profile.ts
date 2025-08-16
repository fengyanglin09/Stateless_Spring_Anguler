import {Component, OnInit} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-profile',
  imports: [JsonPipe, JsonPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  user: any;
  apiResponse: any;

  constructor(private oauthService: OAuthService, private http: HttpClient) {}

  ngOnInit() {
    this.user = this.oauthService.getIdentityClaims();
  }

  callApi() {
    this.http.get('http://localhost:8080/api/protected', {responseType: 'text'}).subscribe({
      next: (response: any) => (this.apiResponse = response),
      error: (err: any) => console.error('API Error:', err),
    });
  }

  logout() {
    this.oauthService.logOut();
  }

  callGraphApi() {
    this.http.get('http://localhost:8080/api/call-graph-with-obo', {responseType: 'text'}).subscribe({
      next: (response: any) => {
        this.apiResponse = response;
        const i = 0;
      },
      error: (err: any) => console.error('API Error:', err),
    });
  }
}
