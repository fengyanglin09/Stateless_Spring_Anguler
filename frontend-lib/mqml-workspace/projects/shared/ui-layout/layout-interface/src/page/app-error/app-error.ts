import { Component } from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'lib-app-error',
  imports: [
    ButtonDirective,
    Ripple,
    RouterLink
  ],
  templateUrl: './app-error.html',
  styleUrl: './app-error.scss'
})
export class AppError {

}
