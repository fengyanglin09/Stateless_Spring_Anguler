import { Component } from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'lib-app-not-found',
  imports: [
    ButtonDirective,
    Ripple,
    RouterLink
  ],
  templateUrl: './app-not-found.html',
  styleUrl: './app-not-found.scss'
})
export class AppNotFound {

}
