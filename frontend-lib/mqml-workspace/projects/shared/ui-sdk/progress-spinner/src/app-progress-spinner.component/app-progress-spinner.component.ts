import {Component, Input} from '@angular/core';
import {ProgressSpinner} from 'primeng/progressspinner';
import {AppStyle} from 'mqml-angular-ui-sdk/api';

@Component({
  selector: 'lib-app-progress-spinner',
  imports: [
    ProgressSpinner
  ],
  templateUrl: './app-progress-spinner.component.html',
  styleUrl: './app-progress-spinner.component.scss'
})
export class AppProgressSpinnerComponent {
  @Input() animationDuration: string = '2s';
  @Input() fill: string = 'none';
  @Input() strokeWidth: string = '2';
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
}
