import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {AppBreadcrumbService, AppNotificationService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {AppButtonComponent} from 'mqml-angular-ui-sdk/button';

@Component({
  selector: 'app-home',
  imports: [
    AppButtonComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {

  @ViewChild("actionTemplate") actionTemplate!: TemplateRef<any>;

  constructor(private breadcrumbService: AppBreadcrumbService,
              private notificationService: AppNotificationService) {
  }

  ngAfterViewInit(): void {
    this.breadcrumbService.set(this.actionTemplate);
  }

  showMessage() {
    this.notificationService.info("This is a notification from home page");
  }


}
