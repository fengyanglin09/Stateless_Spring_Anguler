import {Component, Input} from '@angular/core';
import {AppStyle} from 'mqml-angular-ui-sdk/api';
import {NgClass, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'lib-app-environment-ribbon',
  imports: [
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './app-environment-ribbon.component.html',
  styleUrl: './app-environment-ribbon.component.scss'
})
export class AppEnvironmentRibbonComponent {
  @Input() label: string = '';
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() visible: boolean = false;
}
