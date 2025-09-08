import {Component, inject} from '@angular/core';
import {LayoutService} from '../../service/layout.service';
import {AppConfigurationService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {NgIf} from '@angular/common';

@Component({
  selector: '[lib-app-footer]',
  imports: [
    NgIf
  ],
  templateUrl: './app.footer.html',
  styleUrl: './app.footer.scss',
  host: {
    class: 'layout-footer'
  }
})
export class AppFooter {
  layoutService = inject(LayoutService);

  //Default year and content if not provided in the configuration
  currentYear = new Date().getFullYear();

  constructor(public appConfigurationService: AppConfigurationService) {}
}
