import {Component, Input} from '@angular/core';
import {AppStyle} from '../../../../shared/models/appApi.model';
import {NgClass, NgStyle} from '@angular/common';


@Component({
  selector: 'app-environment-ribbon',
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './app.environment-ribbon.html',
  styleUrl: './app.environment-ribbon.scss'
})
export class AppEnvironmentRibbon {

  @Input() label: string = '';
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() visible: boolean = false;

}
