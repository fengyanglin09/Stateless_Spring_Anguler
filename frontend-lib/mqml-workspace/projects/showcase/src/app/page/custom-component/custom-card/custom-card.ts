import { Component } from '@angular/core';
import {AppCardComponent} from 'mqml-angular-ui-sdk/card';
import {PrimeTemplate} from 'primeng/api';
import {AppButtonComponent} from 'mqml-angular-ui-sdk/button';

@Component({
  selector: 'app-custom-card',
  imports: [
    AppCardComponent,
    PrimeTemplate,
    AppButtonComponent
  ],
  templateUrl: './custom-card.html',
  styleUrl: './custom-card.scss'
})
export class CustomCard {

}
