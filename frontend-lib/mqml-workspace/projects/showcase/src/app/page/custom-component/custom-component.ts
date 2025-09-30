import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-custom-component',
  imports: [
    RouterOutlet
  ],
  templateUrl: './custom-component.html',
  styleUrl: './custom-component.scss'
})
export class CustomComponent {

}
