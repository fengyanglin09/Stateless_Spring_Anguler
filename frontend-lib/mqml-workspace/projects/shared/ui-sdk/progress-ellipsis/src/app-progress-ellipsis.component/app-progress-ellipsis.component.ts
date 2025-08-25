import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import {AppStyle} from 'mqml-angular-ui-sdk/api';

@Component({
  selector: 'lib-app-progress-ellipsis',
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './app-progress-ellipsis.component.html',
  styleUrl: './app-progress-ellipsis.component.scss'
})
export class AppProgressEllipsisComponent {
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
}
