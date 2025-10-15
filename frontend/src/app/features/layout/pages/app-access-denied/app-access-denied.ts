import { Component } from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-app-access-denied',
  imports: [
    ButtonDirective,
    Ripple,
    RouterLink
  ],
  templateUrl: './app-access-denied.html',
  styleUrl: './app-access-denied.scss'
})
export class AppAccessDenied {

}
