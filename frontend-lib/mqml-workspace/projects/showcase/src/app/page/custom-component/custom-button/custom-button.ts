import { Component } from '@angular/core';
import {AppBadgeDirectiveSeverity} from 'mqml-angular-ui-sdk/api';
import {AppNotificationService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {Card} from 'primeng/card';
import {AppButtonComponent} from 'mqml-angular-ui-sdk/button';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-custom-button',
  imports: [
    Card,
    AppButtonComponent,
    NgForOf
  ],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.scss'
})
export class CustomButton {
  badgeSeverities: (AppBadgeDirectiveSeverity)[] = ['success', 'info', 'warn', 'danger'];


  constructor(private notificationService: AppNotificationService) {
  }


  showMessage(message: string): void {
    this.notificationService.info(message);
  }
}
